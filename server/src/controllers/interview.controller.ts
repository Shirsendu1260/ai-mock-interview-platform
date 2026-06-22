import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { db } from '../config/db.js';
import { interviews } from '../db/schema/interviews.js';
import type { NewInterview } from '../db/schema/interviews.js';
import { interviewQuestions, type NewInterviewQuestion, type InterviewQuestion } from '../db/schema/interviewQuestions.js';
import { interviewFeedbacks, type NewInterviewFeedback } from '../db/schema/interviewFeedbacks.js';
import { eq, and, asc, desc } from 'drizzle-orm';
import type { AnswerDataOfQuestion, Difficulty, IErrorMessage } from '../types/types.js';
import Joi from 'joi';
import { cloudinaryDeleter, cloudinaryUploader } from '../utils/cloudinary.js';
import { CREDIT_COST, TIME_PER_QUESTION } from '../constants.js';
import { generateQuestions } from '../services/ai/generateQuestions.js';
import { users } from '../db/schema/users.js';
import { evaluateInterview } from '../services/ai/evaluateInterview.js';

const createInterview = asyncHandler(async (req, res) => {
    const { role, yoe, difficulty, qtnsCount } = req.body as {
        role: string,
        yoe: number,
        difficulty: string,
        qtnsCount: number
    };


    // Auth check
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to start a interview.');
    }

    const authUser = req.user;


    // Code to prevent user from creating new interview if there is any ongoing interview created by him/her
    const [ongoingInterview] = await db.select({ id: interviews.id })
                                        .from(interviews)
                                        .where(and(
                                            eq(interviews.userId, authUser.id),
                                            eq(interviews.status, 'in_progress')
                                        ))
                                        .limit(1);

    if(ongoingInterview) {
        throw new ApiError(409, 'Another interview is already in progress. Complete that one first.');
        // 409: Conflict with the current server state (in_progress interview in db)
    }


    // Validate incoming form data
    const validatorSchema = Joi.object({
        role: Joi.string()
                    .trim()
                    .min(1)
                    .max(125)
                    .required()
                    .messages({
                        'string.empty': 'Role is required.',
                        'any.required': 'Role is required.',
                        'string.min': 'Role must be at least 1 character.',
                        'string.max': 'Role cannot exceed 125 characters.',
                    }),
        yoe: Joi.number()
                    .min(0)
                    .max(50)
                    .precision(1)
                    .required()
                    .messages({
                        'number.base': 'Year of Experience must be a real number.',
                        'number.required': 'Year of Experience is required.',
                        'number.min': 'Year of Experience cannot be a negative number.',
                        'number.max': 'Year of Experience cannot exceed 50.',
                        'number.precision': 'Only 1 decimal place is allowed.',
                    }),
        difficulty: Joi.string()
                        .valid('easy', 'medium', 'hard')
                        .required()
                        .messages({
                            'any.only': 'Difficulty must be either Easy, Medium, or Hard.',
                            'any.required': 'Difficulty is required.'
                        }),
        qtnsCount: Joi.number()
                        .valid(5, 10, 15, 20)
                        .required()
                        .messages({
                            'any.only': 'Questions Count must be either 5, 10, 15, or 20.',
                            'any.required': 'Questions Count is required.'
                        }),
    });


    const { error } = validatorSchema.validate(
        { role, yoe, difficulty, qtnsCount },
        { abortEarly: false }
    );

    if (error) {
        const errorsObj: IErrorMessage = {};

        error.details.forEach(detail => {
            errorsObj[detail.path[0] as string] = detail.message;
        });

        throw new ApiError(400, 'Failed to validate interview form data.', errorsObj);
    }


    // Upload resume file
    const file = req.file as Express.Multer.File | undefined;
    const resumePdfOnLocalPath = file?.path;

    if(!resumePdfOnLocalPath) {
        throw new ApiError(400, 'Resume PDF is required.');
    }

    const resumePdfOnCloudinary = await cloudinaryUploader(resumePdfOnLocalPath);

    if(!resumePdfOnCloudinary) {
        throw new ApiError(400, 'Unable to upload the Resume PDF, please try again.');
    }


    // Calculate interview cost
    const creditCost = CREDIT_COST[difficulty as Difficulty] * qtnsCount;


    // Calculate interview duration
    const interviewDurationInMins = TIME_PER_QUESTION[difficulty as Difficulty] * qtnsCount;

    const interviewDurationInMs = interviewDurationInMins * 60 * 1000; // 1 min = 60 s = 60000 ms

    // Capture a single moment for start time and calculate end time from it
    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + interviewDurationInMs); // getTime() returns in ms


    // Check credits before AI questions generation
    if(authUser.credit < creditCost) {
        throw new ApiError(400, 'Insufficient credits.');
    }


    // Generate questions
    // Here we will extract text from the uploaded pdf, send it to AI, call it, and generate questions
    const questions = await generateQuestions(role, yoe, difficulty, qtnsCount);

    if(questions.length === 0) {
        throw new ApiError(500, 'Unable to generate questions, please try again.');
    }

    if(questions.length !== qtnsCount) {
        throw new ApiError(500, 'Unable to generate the required number of questions.');
    }


    // After successful questions generation, delete the file from Cloudinary
    // Cloudinary deletion should never block interview creation, that's why just catching error if happens
    await cloudinaryDeleter(resumePdfOnCloudinary.secure_url).catch(console.error);


    // A transaction groups multiple database operations into a single atomic unit.
    // Either every operation inside succeeds and changes are committed,
    // or if any operation fails, the database rolls back to its previous state.
    // This prevents inconsistent data such as:
    // Interview row created
    // Questions inserted
    // Credit deduction failed from user row
    // Without a transaction, the database would be left in a partially updated state.
    // With a transaction, either all three happen together or none happen.
    const insertedInterviewData = await db.transaction(async (tx) => {
        // Create interview row
        const newInterview: NewInterview = {
            userId: authUser.id,
            role,
            yoe,
            difficulty,
            qtnsCount,
            creditCost,
            status: 'in_progress',
            lastVisitedQtnPosition: 1,
            startedAt,
            endsAt,
            completedAt: null
        };

        const [createdInterview] = await tx.insert(interviews)
                                            .values(newInterview)
                                            .returning({ id: interviews.id });

        if(!createdInterview) {
            throw new ApiError(500, 'Unable to register the interview session, please try again.');
        }


        // Insert interview_questions rows
        const questionsToInsert = questions.map((qtn, index) => {
            const newQuestion: NewInterviewQuestion = {
                interviewId: createdInterview.id,
                position: index + 1,
                question: qtn,
                answer: null,
                feedback: null,
                score: null
            };

            return newQuestion;
        });

        await tx.insert(interviewQuestions).values(questionsToInsert);


        // Deduct user credits
        const [userCreditsDeducted] = await tx.update(users)
                                                .set({
                                                    credit: authUser.credit - creditCost,
                                                    updatedAt: new Date()
                                                })
                                                .where(eq(users.id, authUser.id))
                                                .returning({ id: users.id });

        if (!userCreditsDeducted) {
            throw new ApiError(500, 'Unable to deduct the credits, please try again.');
        }

        return createdInterview;
    });


    // Return interview id
    return res.status(201)
                .json(
                    new ApiResponse(
                        201,
                        insertedInterviewData,
                        'Interview created successfully.'
                    )
                );
});

// Get interview details
const getInterview = asyncHandler(async (req, res) => {
    const { interviewId } = req.params;


    // Auth check
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to access interview details.');
    }

    const authUser = req.user;


    // Validate interview id
    const validatorSchema = Joi.object({
        interviewId: Joi.string()
                        .uuid()
                        .required()
                        .messages({
                            'string.guid': 'Invalid interview id.',
                            'any.required': 'Interview id is required.'
                        })
    });

    const { error } = validatorSchema.validate(
        { interviewId },
        { abortEarly: false }
    );

    if(error) {
        const errorsObj: IErrorMessage = {};

        error.details.forEach(detail => {
            errorsObj[detail.path[0] as string] = detail.message;
        });

        throw new ApiError(400, 'Failed to validate interview id.', errorsObj);
    }


    // Find interview
    // User should only be able to access his/her own interview
    const [interview] = await db.select({
                                    id: interviews.id,
                                    role: interviews.role,
                                    yoe: interviews.yoe,
                                    difficulty: interviews.difficulty,
                                    qtnsCount: interviews.qtnsCount,
                                    status: interviews.status,
                                    lastVisitedQtnPosition: interviews.lastVisitedQtnPosition,
                                    startedAt: interviews.startedAt,
                                    endsAt: interviews.endsAt,
                                    completedAt: interviews.completedAt
                                })
                                .from(interviews)
                                .where(and(
                                    eq(interviews.id, interviewId as string),
                                    eq(interviews.userId, authUser.id)
                                ))
                                .limit(1);

    if(!interview) {
        throw new ApiError(404, 'Interview not found.');
    }


    // Calculate remaining interview time
    // If interview is already completed, remaining time becomes 0
    let remainingTimeInSeconds = 0;
    const remainingTimeInMs = interview.endsAt.getTime() - Date.now();

    if(interview.status === 'in_progress') {
        remainingTimeInSeconds = Math.max(0, Math.floor(remainingTimeInMs / 1000));
    }


    // Return interview details
    const interviewData = { ...interview, remainingTimeInSeconds };

    return res.status(200)
                .json(
                    new ApiResponse(200, interviewData, 'Interview details fetched successfully.')
                );
});

/*
Get single interview question
This is for:
Previous button, Next button, Question number buttons, Refresh, and Browser close and resume
*/
const getInterviewQuestion = asyncHandler(async (req, res) => {
    const { interviewId, position } = req.params;


    // Auth check
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to access interview questions.');
    }

    const authUser = req.user;


    // Validate route params
    const validatorSchema = Joi.object({
        interviewId: Joi.string()
                        .uuid()
                        .required()
                        .messages({
                            'string.guid': 'Invalid interview id.',
                            'any.required': 'Interview id is required.'
                        }),
        position: Joi.number()
                     .integer()
                     .min(1)
                     .required()
                     .messages({
                        'number.base': 'Question position must be a number.',
                        'number.integer': 'Question position must be an integer.',
                        'number.min': 'Question position must be at least 1.',
                        'any.required': 'Question position is required.'
                     })
    });


    const { error } = validatorSchema.validate(
        {
            interviewId,
            position: Number(position)
        },
        { abortEarly: false }
    );

    if(error) {
        const errorsObj: IErrorMessage = {};

        error.details.forEach(detail => {
            errorsObj[detail.path[0] as string] = detail.message;
        });

        throw new ApiError(400, 'Failed to validate request parameters.', errorsObj);
    }


    // Verify interview ownership
    // Prevents the user from accessing other users' interviews with this - eq(interviews.userId, authUser.id)
    const [interview] = await db.select({
                                    id: interviews.id,
                                    status: interviews.status,
                                    qtnsCount: interviews.qtnsCount
                                })
                                .from(interviews)
                                .where(and(
                                    eq(interviews.id, interviewId as string),
                                    eq(interviews.userId, authUser.id)
                                ))
                                .limit(1);

    if(!interview) {
        throw new ApiError(404, 'Interview not found.');
    }


    // Prevent invalid question positions
    if(Number(position) > interview.qtnsCount) {
        throw new ApiError(404, 'Question not found.');
    }


    // Find question
    const [question] = await db.select({
                                    position: interviewQuestions.position,
                                    question: interviewQuestions.question,
                                    answer: interviewQuestions.answer
                                })
                                .from(interviewQuestions)
                                .where(and(
                                    eq(interviewQuestions.interviewId, interviewId as string),
                                    eq(interviewQuestions.position, Number(position))
                                ))
                                .limit(1)

    if(!question) {
        throw new ApiError(404, 'Question not found.');
    }


    // Return question details
    return res.status(200)
                .json(
                    new ApiResponse(200, question, 'Interview question fetched successfully.')
                );
});

// Save answer of a question
const saveInterviewQuestionAnswer = asyncHandler(async (req, res) => {
    const { interviewId, position } = req.params;
    const { answer } = req.body as { answer: string };


    // Auth check
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to save interview answers.');
    }

    const authUser = req.user;


    // Validate route params and request body
    const validatorSchema = Joi.object({
        interviewId: Joi.string()
                        .uuid()
                        .required()
                        .messages({
                            'string.guid': 'Invalid interview id.',
                            'any.required': 'Interview id is required.'
                        }),
        position: Joi.number()
                     .integer()
                     .min(1)
                     .required()
                     .messages({
                        'number.base': 'Question position must be a number.',
                        'number.integer': 'Question position must be an integer.',
                        'number.min': 'Question position must be at least 1.',
                        'any.required': 'Question position is required.'
                     }),
        answer: Joi.string()
                    .trim()
                    .allow('')
                    .max(10000)
                    .required()
                    .messages({
                        'string.base': 'Answer must be a string.',
                        'any.required': 'Answer is required.',
                        'string.max': 'Answer cannot exceed 10000 characters.',
                    })
    });


    const { error } = validatorSchema.validate(
        {
            interviewId,
            position: Number(position),
            answer
        },
        { abortEarly: false }
    );

    if(error) {
        const errorsObj: IErrorMessage = {};

        error.details.forEach(detail => {
            errorsObj[detail.path[0] as string] = detail.message;
        });

        throw new ApiError(400, 'Failed to validate answer data.', errorsObj);
    }


    // Verify ownership
    const [interview] = await db.select({
                                    id: interviews.id,
                                    qtnsCount: interviews.qtnsCount,
                                    status: interviews.status
                                })
                                .from(interviews)
                                .where(and(
                                    eq(interviews.id, interviewId as string),
                                    eq(interviews.userId, authUser.id)
                                ))
                                .limit(1);

    if(!interview) {
        throw new ApiError(404, 'Interview not found.');
    }


    // If interview is already completed, no need to update its data, and prevention is expected here
    if(interview.status === 'completed') {
        throw new ApiError(400, 'Interview has already been completed.');
    }


    // Prevent invalid question positions
    if(Number(position) > interview.qtnsCount) {
        throw new ApiError(404, 'Question not found.');
    }


    // Ensures both operations succeed together using transaction
    await db.transaction(async (tx) => {
        // Save answer
        const [updatedQtnAns] = await tx.update(interviewQuestions)
                                            .set({
                                                answer,
                                                updatedAt: new Date()
                                            })
                                            .where(and(
                                                eq(interviewQuestions.interviewId, interviewId as string),
                                                eq(interviewQuestions.position, Number(position))
                                            ))
                                            .returning({ id: interviewQuestions.id });

        if(!updatedQtnAns) {
            throw new ApiError(500, 'Unable to save answer, please try again.');
        }


        // Store current position
        // Used for refresh and also for resume after close
        await tx.update(interviews)
                .set({
                    lastVisitedQtnPosition: Number(position),
                    updatedAt: new Date()
                })
                .where(eq(interviews.id, interviewId as string));
    });


    // Return success response
    return res.status(200).json(new ApiResponse(200, null, 'Answer saved successfully.' ));
});

const submitInterview = asyncHandler(async (req, res) => {
    const { interviewId } = req.params;

    // Auth check
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to submit interview answers.');
    }

    const authUser = req.user;


    // Validate route param
    const validatorSchema = Joi.object({
        interviewId: Joi.string()
                        .uuid()
                        .required()
                        .messages({
                            'string.guid': 'Invalid interview id.',
                            'any.required': 'Interview id is required.'
                        })
    });


    const { error } = validatorSchema.validate(
        { interviewId },
        { abortEarly: false }
    );

    if(error) {
        const errorsObj: IErrorMessage = {};

        error.details.forEach(detail => {
            errorsObj[detail.path[0] as string] = detail.message;
        });

        throw new ApiError(400, 'Failed to validate interview id.', errorsObj);
    }


    // Find interview
    const [interview] = await db.select()
                                .from(interviews)
                                .where(and(
                                    eq(interviews.id, interviewId as string),
                                    eq(interviews.userId, authUser.id)
                                ))
                                .limit(1);

    if(!interview) {
        throw new ApiError(404, 'Interview not found.');
    }


    // Prevent duplicate submission
    if(interview.status === 'completed') {
        throw new ApiError(400, 'Interview is already completed.');
    }


    // Get all questions
    const allQtns = await db.select()
                            .from(interviewQuestions)
                            .where(eq(interviewQuestions.interviewId, interviewId as string))
                            .orderBy(asc(interviewQuestions.position));

    if(allQtns.length === 0) {
        throw new ApiError(404, 'Interview questions not found.')
    }


    // Evaluate interview using AI
    const answerDataOfQtns: AnswerDataOfQuestion[] = allQtns.map((qtn) => ({
        question: qtn.question,
        answer: qtn.answer // At this point, if user have answered all, all are saved
    }));

    const evaluationResult = await evaluateInterview(answerDataOfQtns);


    // Either everything succeeds together or nothing gets saved
    await db.transaction(async (tx) => {
        // Update feedback and score of every question
        for(const index in allQtns) {
            const currentQtnRow = allQtns[index] as InterviewQuestion;
            const currentQtnEvaluation = evaluationResult.questions[index];

            await tx.update(interviewQuestions)
                    .set({
                        feedback: currentQtnEvaluation?.feedback,
                        score: currentQtnEvaluation?.score,
                        updatedAt: new Date()
                    })
                    .where(eq(interviewQuestions.id, currentQtnRow.id))
        }

        // Create interview feedback row
        const newInterviewFeedback: NewInterviewFeedback = {
            interviewId: interview.id,
            strengths: evaluationResult.strengths,
            weaknesses: evaluationResult.weaknesses,
            suggestions: evaluationResult.suggestions,
            overallFeedback: evaluationResult.overallFeedback,
            overallScore: evaluationResult.overallScore
        };

        await tx.insert(interviewFeedbacks).values(newInterviewFeedback);

        // Mark this interview completed
        await db.update(interviews)
                .set({
                    status: 'completed',
                    completedAt: new Date(),
                    updatedAt: new Date()
                })
                .where(eq(interviews.id, interviewId as string))
    });


    // Return response
    const finalResponse = {
        interviewId: interview.id,
        overallScore: evaluationResult.overallScore
    };

    return res.status(200).json(
        new ApiResponse(200, finalResponse, 'Interview submitted successfully.')
    );
});

const getInterviewResult = asyncHandler(async (req, res) => {
    const { interviewId } = req.params;


    // Auth check
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to view this interview\'s result.');
    }

    const authUser = req.user;


    // Validate route param
    const validatorSchema = Joi.object({
        interviewId: Joi.string()
                        .uuid()
                        .required()
                        .messages({
                            'string.guid': 'Invalid interview id.',
                            'any.required': 'Interview id is required.'
                        })
    });


    const { error } = validatorSchema.validate(
        { interviewId },
        { abortEarly: false }
    );

    if(error) {
        const errorsObj: IErrorMessage = {};

        error.details.forEach(detail => {
            errorsObj[detail.path[0] as string] = detail.message;
        });

        throw new ApiError(400, 'Failed to validate interview id.', errorsObj);
    }


    // Find interview
    const [interview] = await db.select()
                                .from(interviews)
                                .where(and(
                                    eq(interviews.id, interviewId as string),
                                    eq(interviews.userId, authUser.id)
                                ))
                                .limit(1);

    if(!interview) {
        throw new ApiError(404, 'Interview not found.');
    }


    // Results should only be visible after interview is completed
    if (interview.status !== 'completed') {
        throw new ApiError(400, 'Interview is still in progress.');
    }


    // Get overall feedback
    const [overallFeedback] = await db.select()
                                        .from(interviewFeedbacks)
                                        .where(eq(
                                            interviewFeedbacks.interviewId, interview.id
                                        ))
                                        .limit(1);

    if(!overallFeedback) {
        throw new ApiError(404, 'Interview feedback not found.');
    }


    // Get question-wise results
    const questionResults = await db.select()
                                    .from(interviewQuestions)
                                    .where(eq(
                                        interviewFeedbacks.interviewId, interview.id
                                    ))
                                    .orderBy(asc(interviewQuestions.position));


    // Return response
    const { userId, ...interviewWithoutUserId } = interview;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                interviewWithoutUserId,
                overallFeedback,
                questionResults
            },
            'Interview result fetched successfully.'
        )
    );
});

// App starts, calls /ongoing get endpoint, no interview, show dashboard
// If ongoing interview exists, redirect user back to that interview
const getOngoingInterview = asyncHandler(async (req, res) => {
    // Auth check
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated.');
    }

    const authUser = req.user;


    // Find ongoing interview
    const [ongoingInterview] = await db.select()
                                        .from(interviews)
                                        .where(and(
                                            eq(interviews.userId, authUser.id),
                                            eq(interviews.status, 'in_progress')
                                        ))
                                        .limit(1);

    if(!ongoingInterview) {
        return res.status(200).json(
            new ApiResponse(200, null, 'No ongoing interview found.')
        );
    }


    // Calculate remaining interview time
    const remainingTimeInMs = ongoingInterview.endsAt.getTime() - Date.now();
    const remainingTimeInSeconds = Math.max(0, Math.floor(remainingTimeInMs / 1000));


    // If interview timer is expired already
    if(remainingTimeInSeconds <= 0) {
        new ApiResponse(
            200,
            {
                interviewId: ongoingInterview.id,
                interviewExpired: true
            },
            'No ongoing interview found.'
        )
    }


    // return success response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                interviewId: ongoingInterview.id,
                role: ongoingInterview.role,
                difficulty: ongoingInterview.difficulty,
                qtnsCount: ongoingInterview.qtnsCount,
                lastVisitedQtnPosition: ongoingInterview.lastVisitedQtnPosition,
                remainingTimeInSeconds,
                interviewExpired: false
            },
            'Ongoing interview fetched successfully.'
        )
    );
});

const getInterviewHistory = asyncHandler(async (req, res) => {
    // Auth check
    if (!req.user) {
        throw new ApiError(401, 'You need to be authenticated to view your interview history.');
    }

    const authUser = req.user;


    // Get interviews (all types)
    const interviewHistory = await db.select({
                                            id: interviews.id,
                                            role: interviews.role,
                                            difficulty: interviews.difficulty,
                                            qtnsCount: interviews.qtnsCount,
                                            overallScore: interviewFeedbacks.overallScore,
                                            completedAt: interviews.completedAt,
                                            createdAt: interviews.createdAt
                                        })
                                        .from(interviews)
                                        .innerJoin(
                                            interviewFeedbacks,
                                            eq(interviewFeedbacks.interviewId, interviews.id)
                                        )
                                        .where(eq(interviews.userId, authUser.id))
                                        .orderBy(desc(interviews.completedAt));


    return res.status(200).json(
        new ApiResponse(200, interviewHistory, 'Interview history fetched successfully.')
    );
});

export {
    createInterview,
    getInterview,
    getInterviewQuestion,
    saveInterviewQuestionAnswer,
    submitInterview,
    getInterviewResult,
    getOngoingInterview,
    getInterviewHistory
};
