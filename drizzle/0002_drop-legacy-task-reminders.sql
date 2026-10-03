ALTER TABLE "task_reminders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "task_reminders" CASCADE;--> statement-breakpoint
CREATE INDEX "checklist_items_pack_id_idx" ON "checklist_items" USING btree ("pack_id");