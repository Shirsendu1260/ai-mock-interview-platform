CREATE TABLE "signup_rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firebase_uid" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "signup_rewards_firebase_uid_unique" UNIQUE("firebase_uid"),
	CONSTRAINT "signup_rewards_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "full_name" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "credit" SET DEFAULT 150;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "firebase_uid" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_firebase_uid_unique" UNIQUE("firebase_uid");