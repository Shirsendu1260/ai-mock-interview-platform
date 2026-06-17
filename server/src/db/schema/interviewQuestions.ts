import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { interviews } from './interviews.js';

// Stores individual questions of an interview
export const interviewQuestions = pgTable('interview_questions', {
    id: serial('id').primaryKey(),
    interviewId: integer('interview_id').notNull()
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
});

export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
export type NewInterviewQuestion = typeof interviewQuestions.$inferInsert;
