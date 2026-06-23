import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { db } from '../config/db.js';
import { interviews } from '../db/schema/interviews.js';
import { eq, sql } from 'drizzle-orm';
import { interviewFeedbacks } from '../db/schema/interviewFeedbacks.js';

const getInterviewStats = asyncHandler(async (req, res) => {
    // Auth check
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated.');
    }

    const authUser = req.user;


    // Calculate statistics
    const [stats] = await db.select({
                                totalInterviews: sql<number>`COUNT(*)`,
                                completedInterviews: sql<number>`
                                    COUNT(${interviewFeedbacks.id})
                                `, // because interview_feedbacks table have only completed interviews
                                avgScore: sql<number>`
                                    COALESCE(ROUND(AVG(${interviewFeedbacks.overallScore})), 0)
                                `,
                                bestScore: sql<number>`
                                    COALESCE(MAX(${interviewFeedbacks.overallScore}), 0)
                                `
                            })
                            .from(interviews)
                            .leftJoin(
                                interviewFeedbacks,
                                eq(interviewFeedbacks.interviewId, interviews.id)
                            )
                            .where(eq(interviews.userId, authUser.id));
    /*
    SELECT
    COUNT(*) AS total_interviews,
    COUNT(interview_feedbacks.id) AS completed_interviews,
    COALESCE(ROUND(AVG(interview_feedbacks.overall_score)), 0) AS avg_score,
    COALESCE(MAX(interview_feedbacks.overall_score), 0) AS best_score
    FROM interviews
    LEFT JOIN interview_feedbacks
    ON interviews.id = interview_feedbacks.interview_id
    WHERE interviews.user_id = ?
    */


    // return response
    return res.status(200).json(
        new ApiResponse(200, stats, 'Interview statistics fetched successfully.')
    );
});

export { getInterviewStats };
