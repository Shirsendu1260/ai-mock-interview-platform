import { db } from "../config/db.js";
import { JOB_SEARCH_CREDIT_COST, JOBS_PER_PAGE } from "../constants.js";
import { users } from "../db/schema/users.js";
import { searchJobs } from "../services/jobs/adzuna.service.js";
import { extractJobKeywords } from "../services/jobs/jobKeywordExtractor.js";
import { extractResumeText } from "../services/pdf/extractResumeText.js";
import type { IJobKeywordExtractionResponse } from "../types/types.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { eq } from 'drizzle-orm';

const searchJobsController = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to search jobs.');
    }

    const authUser = req.user;

    const { state, district, page = 1 } = req.body;

    const resumePath = req.file?.path;

    if(!resumePath) {
        throw new ApiError(400, 'Resume PDF is required.');
    }

    if(authUser.credit < JOB_SEARCH_CREDIT_COST) {
        throw new ApiError(400, 'Insufficient credits.');
    }

    const resumeText = await extractResumeText(resumePath);
    const keywordData = await extractJobKeywords(resumeText);
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

        const resultJobs = await searchJobs(
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
                hasMore,
                searchData
            },
            'Jobs fetched successfully.'
        )
    );
});

const loadMoreJobsController = asyncHandler(async (req, res) => {
    const validatorSchema = Joi.object({
        page: Joi.number().integer().min(2).required(),
        searchData: Joi.object({
            role: Joi.string().required(),
            skills: Joi.array()
                        .items(Joi.string().min(1).max(100).required())
                        .min(1)
                        .max(10)
                        .required(),
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

    const jobs = await searchJobs(
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

export { searchJobs, loadMoreJobs };
