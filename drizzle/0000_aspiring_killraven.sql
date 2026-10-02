CREATE TABLE "loans" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"bank" text NOT NULL,
	"icon" text DEFAULT 'credit_card' NOT NULL,
	"due_notice" text DEFAULT '' NOT NULL,
	"due_date" text DEFAULT '' NOT NULL,
	"monthly_amount" real NOT NULL,
	"remaining_amount" real NOT NULL,
	"total_amount" real NOT NULL,
	"paid_installments" integer DEFAULT 0 NOT NULL,
	"total_installments" integer DEFAULT 0 NOT NULL,
	"progress_percent" real DEFAULT 0 NOT NULL,
	"linked_account" text,
	"auto_pay" boolean DEFAULT false NOT NULL,
	"category" text DEFAULT 'personal' NOT NULL,
	"paid_this_cycle" boolean DEFAULT false NOT NULL,
	"badge_text" text,
	"badge_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL,
	"provider" text NOT NULL,
	"odometer_km" integer NOT NULL,
	"cost" real DEFAULT 0 NOT NULL,
	"receipt_verified" boolean DEFAULT false NOT NULL,
	"notes" text,
	"category" text DEFAULT 'Service' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_trackers" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"category" text DEFAULT 'healthy' NOT NULL,
	"badge_text" text DEFAULT '' NOT NULL,
	"badge_type" text DEFAULT 'primary' NOT NULL,
	"icon" text DEFAULT 'directions_car' NOT NULL,
	"current_km" integer,
	"target_km" integer,
	"interval_km" integer,
	"percentage" integer,
	"time_elapsed_months" integer,
	"time_total_months" integer,
	"target_date" text,
	"scheduled_at_km" integer,
	"extra_detail" text,
	"auto_pay" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist_items" (
	"id" text PRIMARY KEY NOT NULL,
	"pack_id" text NOT NULL,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist_packs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"icon" text DEFAULT 'checklist' NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_reminders" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"due_time" text NOT NULL,
	"due_date_category" text DEFAULT 'today' NOT NULL,
	"priority" text,
	"category" text DEFAULT 'work' NOT NULL,
	"source" text,
	"location" text,
	"recurring" text,
	"done" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timeline_events" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"time_label" text NOT NULL,
	"date_badge" text NOT NULL,
	"category" text NOT NULL,
	"category_label" text NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"icon" text DEFAULT 'event' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_pack_id_checklist_packs_id_fk" FOREIGN KEY ("pack_id") REFERENCES "public"."checklist_packs"("id") ON DELETE cascade ON UPDATE no action;