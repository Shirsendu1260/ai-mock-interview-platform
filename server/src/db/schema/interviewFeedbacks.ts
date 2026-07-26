import { pgTable, uuid, integer, text, timestamp, index } from 'drizzle-orm/pg-core';
import { interviews } from './interviews.js';

export const interviewFeedbacks = pgTable('interview_feedbacks', {
    id: uuid('id').defaultRandom().primaryKey(),
    interviewId: uuid('interview_id').notNull()
                                        .references(
                                            () => interviews.id,
                                            { onDelete: 'cascade' }
                                        ),
    strengths: text('strengths'),
    weaknesses: text('weaknesses'),
    suggestions: text('suggestions'),
    overallFeedback: text('overall_feedback'),

    // Will be filled after evaluation
    overallScore: integer('overall_score'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
    // Used while joining interview feedback
    // Makes interview-to-feedback join much faster because feedback is always fetched using interviewId
    interviewIdIdx: index('feedback_interview_id_idx').on(table.interviewId),

    // Used for sorting/filtering by overall score
    // Improves score filtering and score sorting in interview history
    overallScoreIdx: index('feedback_score_idx').on(table.overallScore)
}));

export type InterviewFeedback = typeof interviewFeedbacks.$inferSelect;
export type NewInterviewFeedback = typeof interviewFeedbacks.$inferInsert;
