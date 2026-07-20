ALTER TABLE "payments" ADD COLUMN "failure_code" varchar(128);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "failure_reason" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "failure_source" varchar(128);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "failure_step" varchar(128);