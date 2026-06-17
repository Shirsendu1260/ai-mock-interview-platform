import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { db } from '../config/db.js';
import { interviews } from '../db/schema/interviews.js';
import type { NewInterview } from '../db/schema/interviews.js';
import { eq } from 'drizzle-orm';

// verifyJWT middleware -> multer.single('resume') -> createInterview controller -> JOI validation ->
// Check credits -> Upload pdf to Cloudinary -> Extract text from pdf -> Delete it from Cloudinary ->
// Generate AI questions -> DB operations (add to interviews and interview_questions) -> Deduct credits -> return
const createInterview = asyncHandler(async (req, res) => {

});

export {
    createInterview
};
