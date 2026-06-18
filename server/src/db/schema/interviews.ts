import { pgTable, uuid, varchar, integer, real, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const interviews = pgTable('interviews', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: integer('user_id').notNull()
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
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;
