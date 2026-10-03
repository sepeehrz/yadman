CREATE TABLE "insurances" (
	"id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text NOT NULL,
	"type" text DEFAULT 'third-party' NOT NULL,
	"company" text NOT NULL,
	"policy_number" text,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"cost" real,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" text DEFAULT 'build' NOT NULL,
	"default_interval_km" integer,
	"default_interval_months" integer
);
--> statement-breakpoint
CREATE TABLE "tolls" (
	"id" text PRIMARY KEY NOT NULL,
	"vehicle_id" text NOT NULL,
	"year" text NOT NULL,
	"amount" real NOT NULL,
	"paid" boolean DEFAULT false NOT NULL,
	"paid_at" text,
	"due_date" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand" text DEFAULT '' NOT NULL,
	"model" text DEFAULT '' NOT NULL,
	"year" integer,
	"color" text DEFAULT '' NOT NULL,
	"plate_number" text NOT NULL,
	"vin" text,
	"fuel_type" text DEFAULT 'benzin' NOT NULL,
	"odometer_km" integer DEFAULT 0 NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_plate_number_unique" UNIQUE("plate_number")
);
--> statement-breakpoint
ALTER TABLE "service_logs" ADD COLUMN "vehicle_id" text;--> statement-breakpoint
ALTER TABLE "service_logs" ADD COLUMN "category_id" text;--> statement-breakpoint
ALTER TABLE "service_logs" ADD COLUMN "next_due_date" text;--> statement-breakpoint
ALTER TABLE "service_logs" ADD COLUMN "next_due_km" integer;--> statement-breakpoint
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tolls" ADD CONSTRAINT "tolls_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_logs" ADD CONSTRAINT "service_logs_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_logs" ADD CONSTRAINT "service_logs_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE set null ON UPDATE no action;