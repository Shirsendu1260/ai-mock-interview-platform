ALTER TABLE "payments" ADD COLUMN "receipt" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_receipt_unique" UNIQUE("receipt");