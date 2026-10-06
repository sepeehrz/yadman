ALTER TABLE "vehicles" DROP COLUMN "brand";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "model";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "color";--> statement-breakpoint
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_plate_number_unique";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "plate_number";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "vin";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "fuel_type";
