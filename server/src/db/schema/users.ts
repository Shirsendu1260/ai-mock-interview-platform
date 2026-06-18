import { pgTable, uuid, varchar, integer, text, timestamp } from 'drizzle-orm/pg-core';

// Schema for 'users' table
export const users = pgTable('users', {
	// Primary Key, random unique string on every new registration
	id: uuid('id').defaultRandom().primaryKey(),

	// Full Name, max 125 characters, must not be empty
	fullName: varchar('full_name', { length: 125 }).notNull(),

	// Email address, max 255 characters, must be unique across the entire table
	email: varchar('email', { length: 255 }).notNull().unique(),

	// Stores image url coming from Google/GitHub
	avatarUrl: text('avatar_url'),

	// Credit system for token usage, defaults to 300, cannot be empty
	credit: integer('credit').default(300).notNull(),

	// Saves refresh JWT token string for token rotation
	refreshToken: text('refresh_token'),

	// Automatically record the exact moment the row is created
	// We pass withTimezone: true so that no matter where our server runs globally, the time calculations 
	// never get corrupted.
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

	// Updates whenever a row is modified
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Infer Types
// This generates a clean TypeScript type directly from your database layout
// This ensures total type safety when writing in controllers
export type User = typeof users.$inferSelect; // Type for fetching a user
export type NewUser = typeof users.$inferInsert; // Type for creating a user
