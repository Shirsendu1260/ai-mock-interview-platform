CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(125) NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar_url" text,
	"credit" integer DEFAULT 300 NOT NULL,
	"refresh_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(125) NOT NULL,
	"yoe" real NOT NULL,
	"difficulty" varchar(10) NOT NULL,
	"qtns_count" integer NOT NULL,
	"credit_cost" integer NOT NULL,
	"status" varchar(20) DEFAULT 'in_progress' NOT NULL,
	"last_visited_qtn_position" integer DEFAULT 1 NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"question" text NOT NULL,
	"answer" text,
	"feedback" text,
	"score" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_feedbacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_id" uuid NOT NULL,
	"strengths" text,
	"weaknesses" text,
	"suggestions" text,
	"overall_feedback" text,
	"overall_score" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_feedbacks" ADD CONSTRAINT "interview_feedbacks_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE cascade ON UPDATE no action;