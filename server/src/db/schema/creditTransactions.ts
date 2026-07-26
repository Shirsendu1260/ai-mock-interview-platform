import { pgTable, uuid, integer, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { payments } from './payments.js';

export const creditTransactions = pgTable('credit_transactions', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'cascade' }),
    credits: integer('credits').notNull(),
    type: varchar('type', { length: 40 }).notNull(), // interview, purchase etc.
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (table) => ({
    // Used for faster credit history page fetching
    userCreatedIdx: index('credit_transactions_user_created_idx').on(table.userId, table.createdAt)
}));

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof creditTransactions.$inferInsert;
