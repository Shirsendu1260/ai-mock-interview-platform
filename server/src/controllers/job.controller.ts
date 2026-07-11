import Joi from "joi";
import { db } from "../config/db.js";
import { JOB_SEARCH_CREDIT_COST, JOBS_PER_PAGE } from "../constants.js";
import { users } from "../db/schema/users.js";
import { searchJobsFromAdzuna } from "../services/jobs/adzuna.service.js";
import { extractJobKeywords } from "../services/jobs/jobKeywordExtractor.js";
import { extractResumeText } from "../services/pdf/extractResumeText.js";
import type { IBookmarkJob, IErrorMessage, IJobSearchData, ILoadMoreJobsRequest } from "../types/types.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { eq, and, desc } from 'drizzle-orm';
import { creditTransactions, type NewCreditTransaction } from "../db/schema/creditTransactions.js";
import { bookmarkedJobs } from "../db/schema/bookmarkedJobs.js";

const searchJobs = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to search jobs.');
    }

    const authUser = req.user;

    const { state, district, page = 1 } = req.body as {
        state: string,
        district?: string,
        page: number
    };

    const validatorSchema = Joi.object({
        state: Joi.string()
                    .required()
                    .messages({
                        'string.base': 'State must be a string.',
                        'string.empty': 'State cannot be empty.',
                        'any.required': 'State is required.'
                    }),
        district: Joi.string()
                        .allow('')
                        .messages({
                            'string.base': 'District must be a string.'
                        }),
        page: Joi.number()
                    .integer()
                    .valid(1)
                    .required()
                    .messages({
                        'number.base': 'Page must be a number.',
                        'number.integer': 'Page must be an integer.',
                        'any.only': 'Page must be exactly 1.',
                        'any.required': 'Page is required.'
                    })
    });

    const { error, value } = validatorSchema.validate({ state, district, page }, {
        abortEarly: false,
        stripUnknown: true
    });

    if(error) {
        const errors: IErrorMessage = {};

        error.details.forEach(detail => {
            errors[detail.path[0] as string] = detail.message;
        });

        throw new ApiError(400, "Validation failed for load more jobs request.", errors);
    }

    const resumePath = req.file?.path;

    if(!resumePath) {
        throw new ApiError(400, 'Resume PDF is required.');
    }

    if(authUser.credit < JOB_SEARCH_CREDIT_COST) {
        throw new ApiError(400, 'Insufficient credits.');
    }

    const resumeText = await extractResumeText(resumePath);
    
    let keywordData;
    try {
        keywordData = await extractJobKeywords(resumeText);
    }
    catch {
        keywordData = {
            role: 'Software Developer',
            skills: ['Developer']
        };
    }

    const searchData: IJobSearchData = { ...keywordData, state, district };

    const jobs = await db.transaction(async (tx) => {
        const [currentUser] = await tx.select({ credit: users.credit })
                                        .from(users)
                                        .where(eq(users.id, authUser.id))
                                        .limit(1);

        if(!currentUser) {
            throw new ApiError(404, 'User not found.');
        }

        if(currentUser.credit < JOB_SEARCH_CREDIT_COST) {
            throw new ApiError(400, 'Insufficient credits.');
        }

        await tx.update(users)
                    .set({
                        credit: currentUser.credit - JOB_SEARCH_CREDIT_COST,
                        updatedAt: new Date()
                    })
                    .where(eq(users.id, authUser.id));

        // Insert credit transaction
        const newCreditTransaction: NewCreditTransaction = {
            userId: authUser.id,
            credits: JOB_SEARCH_CREDIT_COST,
            type: 'job_search',
        };

        await tx.insert(creditTransactions).values(newCreditTransaction);

        const resultJobs = await searchJobsFromAdzuna(
            searchData.role,
            searchData.skills,
            searchData.state,
            searchData.district,
            page
        );

        return resultJobs;
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobs,
                page,
                hasMore: jobs.length === JOBS_PER_PAGE,
                searchData
            },
            'Jobs fetched successfully.'
        )
    );
});

const loadMoreJobs = asyncHandler(async (req, res) => {
    const validatorSchema = Joi.object({
        page: Joi.number().integer().min(2).required(),
        searchData: Joi.object({
            role: Joi.string().required(),
            skills: Joi.array()
                        .items(Joi.string().trim().min(1).max(100))
                        .default([]),
            state: Joi.string().required(),
            district: Joi.string().allow("")
        }).required()
    });

    const { error, value } = validatorSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if(error) {
        const errors: IErrorMessage = {};

        error.details.forEach(detail => {
            errors[detail.path.join('.')] = detail.message;
        });

        throw new ApiError(400, "Validation failed for load more jobs request.", errors);
    }

    const { searchData, page }: ILoadMoreJobsRequest = value;

    const jobs = await searchJobsFromAdzuna(
                            searchData.role,
                            searchData.skills,
                            searchData.state,
                            searchData.district,
                            page
                        );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobs,
                page,
                hasMore: jobs.length === JOBS_PER_PAGE
            },
            'Jobs fetched successfully.'
        )
    );
});

const bookmarkJob = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to bookmark a job.');
    }

    const authUser = req.user;

    const validatorSchema = Joi.object({
        jobId: Joi.string().required(),
        title: Joi.string().required(),
        company: Joi.string().required(),
        location: Joi.string().required(),
        salary: Joi.string().allow(null, ''),
        description: Joi.string().required(),
        redirectUrl: Joi.string().uri().required()
    });

    const { error, value } = validatorSchema.validate(req.body, {
        abortEarly: false
    });

    if(error) {
        const errors: IErrorMessage = {};

        error.details.forEach(detail => {
            errors[detail.path[0] as string] = detail.message;
        });

        throw new ApiError(400, 'Validation failed for job bookmark process.', errors);
    }

    const job = value as IBookmarkJob;

    const [alreadyBookmarked] = await db.select({ id: bookmarkedJobs.id })
                                        .from(bookmarkedJobs)
                                        .where(and(
                                            eq(bookmarkedJobs.userId, authUser.id),
                                            eq(bookmarkedJobs.jobId, job.jobId)
                                        ))
                                        .limit(1);

    if(alreadyBookmarked) {
        throw new ApiError(409, 'Job already bookmarked.');
    }

    await db.insert(bookmarkedJobs).values({
        userId: req.user.id,
        ...job
    });

    return res.status(201).json(
        new ApiResponse(201, null, 'Job bookmarked successfully.')
    );
});

const removeBookmark = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to remove a job bookmark.');
    }

    const authUser = req.user;

    const validatorSchema = Joi.object({
        jobId: Joi.string().required()
    });

    const { error, value } = validatorSchema.validate(req.params, {
        abortEarly: false
    });

    if(error) {
        const errors: IErrorMessage = {};

        error.details.forEach(detail => {
            errors[detail.path[0] as string] = detail.message;
        });

        throw new ApiError(400, 'Validation failed for remove job bookmark process.', errors);
    }

    const jobId = String(value.jobId);

    // Delete the bookmarked job
    const deletedBookmarkedJob = await db.delete(bookmarkedJobs)
                                            .where(and(
                                                eq(bookmarkedJobs.userId, authUser.id),
                                                eq(bookmarkedJobs.jobId, jobId)
                                            ))
                                            .returning({ id: bookmarkedJobs.id });

    if(deletedBookmarkedJob.length === 0) {
        throw new ApiError(404, 'Bookmark not found.');
    }

    return res.status(200).json(
        new ApiResponse(200, null, 'Bookmark removed successfully.')
    );
});

const getBookmarkedJobs = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to get bookmarked jobs list.');
    }

    const authUser = req.user;

    const validatorSchema = Joi.object({
        page: Joi.number().integer().min(1).default(1)
    });

    const { error, value } = validatorSchema.validate(req.query, {
        abortEarly: false
    });

    if(error) {
        const errors: IErrorMessage = {};

        error.details.forEach(detail => {
            errors[detail.path[0] as string] = detail.message;
        });

        throw new ApiError(400, 'Validation failed for get bookmarked jobs.', errors);
    }

    const page = Number(value.page);

    const jobs = await db.select({
                                jobId: bookmarkedJobs.jobId,
                                title: bookmarkedJobs.title,
                                company: bookmarkedJobs.company,
                                location: bookmarkedJobs.location,
                                salary: bookmarkedJobs.salary,
                                description: bookmarkedJobs.description,
                                redirectUrl: bookmarkedJobs.redirectUrl
                            })
                            .from(bookmarkedJobs)
                            .where(eq(bookmarkedJobs.userId, authUser.id))
                            .orderBy(desc(bookmarkedJobs.createdAt))
                            .limit(JOBS_PER_PAGE + 1) // Fetch one eztra job for 'hasMore' check, if page size is 6, fetch 7
                            .offset((page - 1) * JOBS_PER_PAGE);

    // Check if there are more jobs after this page
    const hasMore = jobs.length > JOBS_PER_PAGE;

    // Remove the extra job we fetched only for checking 'hasMore'
    if(hasMore) {
        jobs.pop();
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobs,
                page,
                hasMore
            },
            'Bookmarked jobs fetched successfully.'
        )
    );
});

const getBookmarkedJobIds = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to get bookmarked jobs ids.');
    }

    const authUser = req.user;

    const jobs = await db.select({
                                jobId: bookmarkedJobs.jobId
                            })
                            .from(bookmarkedJobs)
                            .where(eq(bookmarkedJobs.userId, authUser.id));

    const jobIds = jobs.map(job => job.jobId);

    return res.status(200).json(
        new ApiResponse(
            200,
            jobIds,
            'Bookmarked ids fetched successfully.'
        )
    );
});

export { searchJobs, loadMoreJobs, bookmarkJob, removeBookmark, getBookmarkedJobs, getBookmarkedJobIds };
