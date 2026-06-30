import { pgTable, uuid, timestamp, varchar } from 'drizzle-orm/pg-core';

export const signupRewards = pgTable('signup_rewards', {
    id: uuid('id').defaultRandom().primaryKey(),
    firebaseUid: varchar('firebase_uid', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export type SignupReward = typeof signupRewards.$inferSelect;
export type NewSignupReward = typeof signupRewards.$inferInsert;
