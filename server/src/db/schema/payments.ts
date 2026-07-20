import { pgTable, uuid, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';
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
});

export type NewPayment = typeof payments.$inferInsert;
export type Payment = typeof payments.$inferSelect;
