import { pgTable, uuid, integer, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    razorpayOrderId: varchar('razorpay_order_id', { length: 255 }).notNull().unique(),
    razorpayPaymentId: varchar('razorpay_payment_id', { length: 255 }),
    razorpaySignature: varchar('razorpay_signature', { length: 255 }),
    receipt: uuid('receipt').notNull().unique(),
    plan: varchar('plan', { length: 20 }).notNull(),
    amount: integer('amount').notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    failureCode: varchar('failure_code', { length: 128 }),
    failureReason: text('failure_reason'),
    failureSource: varchar('failure_source', { length: 128 }),
    failureStep: varchar('failure_step', { length: 128 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    // Used for faster payment history fetching
    userIdIdx: index('payments_user_id_idx').on(table.userId),

    // Used while removing expired created payments
    // Makes cleanup of expired created payments much faster by filtering created payments with createdAt
    statusIdx: index('payments_status_idx').on(table.status),

    // Used for payment history ordering
    userCreatedIdx: index('payments_user_created_idx').on(table.userId, table.createdAt)
}));

export type NewPayment = typeof payments.$inferInsert;
export type Payment = typeof payments.$inferSelect;
