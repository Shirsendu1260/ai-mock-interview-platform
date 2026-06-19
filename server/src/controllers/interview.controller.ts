import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { db } from '../config/db.js';
import { interviews } from '../db/schema/interviews.js';
import type { NewInterview } from '../db/schema/interviews.js';
import { interviewQuestions, type NewInterviewQuestion } from '../db/schema/interviewQuestions.js';
import { eq, and } from 'drizzle-orm';
import type { Difficulty, IErrorMessage } from '../types/types.js';
import Joi from 'joi';
import { cloudinaryDeleter, cloudinaryUploader } from '../utils/cloudinary.js';
import { CREDIT_COST, TIME_PER_QUESTION } from '../constants.js';
import { generateQuestions } from '../services/ai/generateQuestions.js';
import { users } from '../db/schema/users.js';

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

export {
    createInterview
};
