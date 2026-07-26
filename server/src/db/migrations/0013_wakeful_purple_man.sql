CREATE INDEX "interviews_user_id_idx" ON "interviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "interviews_completed_at_idx" ON "interviews" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "interviews_difficulty_idx" ON "interviews" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "interviews_user_completed_idx" ON "interviews" USING btree ("user_id","completed_at");--> statement-breakpoint
CREATE INDEX "questions_interview_id_idx" ON "interview_questions" USING btree ("interview_id");--> statement-breakpoint
CREATE INDEX "questions_interview_position_idx" ON "interview_questions" USING btree ("interview_id","position");--> statement-breakpoint
CREATE INDEX "feedback_interview_id_idx" ON "interview_feedbacks" USING btree ("interview_id");--> statement-breakpoint
CREATE INDEX "feedback_score_idx" ON "interview_feedbacks" USING btree ("overall_score");--> statement-breakpoint
CREATE INDEX "payments_user_id_idx" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_user_created_idx" ON "payments" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "credit_transactions_user_created_idx" ON "credit_transactions" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "bookmarked_jobs_user_idx" ON "bookmarked_jobs" USING btree ("user_id");