CREATE TABLE "bookmarked_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"salary" varchar(255),
	"description" text NOT NULL,
	"redirect_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarked_jobs_user_id_job_id_unique" UNIQUE("user_id","job_id")
);
--> statement-breakpoint
ALTER TABLE "bookmarked_jobs" ADD CONSTRAINT "bookmarked_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;