import { pgTable, uuid, text, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const bookmarkedJobs = pgTable("bookmarked_jobs", {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
        jobId: varchar("job_id", { length: 255 }).notNull(),
        title: varchar("title", { length: 255 }).notNull(),
        company: varchar("company", { length: 255 }).notNull(),
        location: varchar("location", { length: 255 }).notNull(),
        salary: varchar("salary", { length: 255 }),
        description: text("description").notNull(),
        redirectUrl: text("redirect_url").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
    },

    (table) => ({ // This callback gives access to the table's column
        uniqueBookmark: unique().on( // Creates a composite unique constraint in the table
            table.userId,
            table.jobId
        ) // This combination of userId and jobId must be unique together

        // It is created so that a user can only bookmark a specific job once
        // user1, job123 -> allowed
        // user1, job567 -> allowed
        // user1, job123 -> not allowed, it is duplicate, already created earlier
    }
));

export type NewBookmarkedJob = typeof bookmarkedJobs.$inferInsert;
export type BookmarkedJob = typeof bookmarkedJobs.$inferSelect;
