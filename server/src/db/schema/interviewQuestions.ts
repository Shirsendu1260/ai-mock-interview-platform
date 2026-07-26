import { pgTable, uuid, integer, text, timestamp, index } from 'drizzle-orm/pg-core';
import { interviews } from './interviews.js';

// Stores individual questions of an interview
export const interviewQuestions = pgTable('interview_questions', {
    id: uuid('id').defaultRandom().primaryKey(),
    interviewId: uuid('interview_id').notNull()
                                        .references(
                                            () => interviews.id,
                                            { onDelete: 'cascade' }
                                        ),

    // Question order
    position: integer('position').notNull(),

    // AI generated question
    question: text('question').notNull(),

    // User answer
    answer: text('answer'),

    // AI generated feedback
    feedback: text('feedback'),

    // Score given by AI
    score: integer('score'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
    // Used while loading interview questions
    // Speeds up loading interview questions because questions are always fetched using interviewId
    interviewIdIdx: index('questions_interview_id_idx').on(table.interviewId),

    // Used while navigating question numbers
    // Makes question navigation faster because questions are usually ordered by position inside an interview
    interviewPositionIdx: index('questions_interview_position_idx').on(table.interviewId, table.position)
}));

export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
export type NewInterviewQuestion = typeof interviewQuestions.$inferInsert;
