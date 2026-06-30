import { pgTable, uuid, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const creditTransactions = pgTable('credit_transactions', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    credits: integer('credits').notNull(),
    type: varchar('type', { length: 40 }).notNull(), // interview, purchase etc.
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof creditTransactions.$inferInsert;
