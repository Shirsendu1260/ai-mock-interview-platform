import { pgTable, uuid, varchar, integer, real, timestamp } from 'drizzle-orm/pg-core';
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
});

export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;
