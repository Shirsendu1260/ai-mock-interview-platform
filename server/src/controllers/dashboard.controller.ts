import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { db } from '../config/db.js';
import { interviews } from '../db/schema/interviews.js';
import { eq, sql, desc } from 'drizzle-orm';
import { interviewFeedbacks } from '../db/schema/interviewFeedbacks.js';
import { PAGINATION_LIMIT } from '../constants.js';

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


    if(!stats) {
        throw new ApiError(500, 'Unable to fetch dashboard statistics.');
    }


    // return response
    return res.status(200).json(
        new ApiResponse(200, stats, 'Interview statistics fetched successfully.')
    );
});

const getRecentInterviews = asyncHandler(async (req, res) => {
    // Auth check
    if(!req.user) {
        throw new ApiError(401, 'You need to be authenticated to view your recent interviews.');
    }

    const authUser = req.user;


    // Get a limited number of latest recent interviews
    const recentInterviews = await db.select({
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
                                        .orderBy(desc(interviews.completedAt))
                                        .limit(PAGINATION_LIMIT);


    return res.status(200).json(
        new ApiResponse(200, recentInterviews, 'Recent interviews fetched successfully.')
    );
});

export { getInterviewStats, getRecentInterviews };
