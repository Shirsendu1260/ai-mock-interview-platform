import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { db } from '../config/db.js';
import { interviews } from '../db/schema/interviews.js';
import type { NewInterview } from '../db/schema/interviews.js';
import { eq } from 'drizzle-orm';

// User clicks Start Interview -> Controller -> Authentication check -> Prevent multiple ongoing interviews ->
// Joi validation -> Calculate interview cost -> Calculate interview duration -> Create interview row ->
// Generate questions -> Insert interview_questions rows -> Deduct user credits -> Return interview id
const createInterview = asyncHandler(async (req, res) => {

});

export {
    createInterview
};
