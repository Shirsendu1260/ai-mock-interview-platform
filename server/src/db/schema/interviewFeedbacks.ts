import { pgTable, uuid, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { interviews } from './interviews.js';

export const interviewFeedbacks = pgTable('interview_feedbacks', {
    id: uuid('id').defaultRandom().primaryKey(),
    interviewId: integer('interview_id').notNull()
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
});

export type InterviewFeedback = typeof interviewFeedbacks.$inferSelect;
export type NewInterviewFeedback = typeof interviewFeedbacks.$inferInsert;
