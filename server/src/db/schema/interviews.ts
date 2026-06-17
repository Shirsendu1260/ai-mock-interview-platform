import { pgTable, serial, varchar, integer, real, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { DIFFICULTIES, INTERVIEW_STATUS } from '../../constants.js';
import { users } from './users.js';

const difficultyEnum = pgEnum('difficulty', DIFFICULTIES);
const statusEnum = pgEnum('status', INTERVIEW_STATUS);

export const interviews = pgTable('interviews', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull()
                              .references(
                                  () => users.id,
                                  { onDelete: 'cascade' }
                               ),
    role: varchar('role', { length: 125 }).notNull(),
    yoe: real('yoe').notNull(),
    difficulty: difficultyEnum('difficulty').notNull(),
    qtnsCount: integer('qtns_count').notNull(),
    creditCost: integer('credit_cost').notNull(),
    status: statusEnum('status').default('in_progress').notNull(),

    // Will be filled after evaluation
    overallScore: integer('overall_score'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;
