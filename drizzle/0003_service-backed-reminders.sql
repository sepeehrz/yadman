CREATE TABLE "task_reminders" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"due_at" timestamp with time zone NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"recurrence" text DEFAULT 'none' NOT NULL,
	"snoozed_until" timestamp with time zone,
	"done" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "task_reminders_due_at_idx" ON "task_reminders" USING btree ("due_at");