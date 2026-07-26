import { pgTable, uuid, varchar, integer, real, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const interviews = pgTable('interviews', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull()
                              .references(
                                  () => users.id,
                                  { onDelete: 'cascade' }
                               ),
    role: varchar('role', { length: 125 }).notNull(),
    yoe: real('yoe').notNull(),
    difficulty: varchar('difficulty', { length: 10 }).notNull(),
    qtnsCount: integer('qtns_count').notNull(),
    creditCost: integer('credit_cost').notNull(),
    status: varchar('status', { length: 20 }).default('in_progress').notNull(),

    // Current question user is in
    lastVisitedQtnPosition: integer('last_visited_qtn_position').default(1).notNull(),

    // Interview start time
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),

    // Interview end time
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),

    // When user completes interview
    completedAt: timestamp('completed_at', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
    // Used while fetching a user's interview history
    // Speeds up loading a user's interview history because almost every query filters by userId
    userIdIdx: index('interviews_user_id_idx').on(table.userId),

    // Used for sorting by completion date
    // Helps sorting interview history by completion date without scanning the whole table
    completedAtIdx: index('interviews_completed_at_idx').on(table.completedAt),

    // Used for filtering interviews by difficulty
    difficultyIdx: index('interviews_difficulty_idx').on(table.difficulty),

    // Used together with userId for interview history
    userCompletedIdx: index('interviews_user_completed_idx').on(table.userId, table.completedAt)
}));

export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;
