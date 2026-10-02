import { boolean, integer, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

export const vehicleTrackers = pgTable("vehicle_trackers", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  category: text("category").notNull().default("healthy"),
  badgeText: text("badge_text").notNull().default(""),
  badgeType: text("badge_type").notNull().default("primary"),
  icon: text("icon").notNull().default("directions_car"),
  currentKm: integer("current_km"),
  targetKm: integer("target_km"),
  intervalKm: integer("interval_km"),
  percentage: integer("percentage"),
  timeElapsedMonths: integer("time_elapsed_months"),
  timeTotalMonths: integer("time_total_months"),
  targetDate: text("target_date"),
  scheduledAtKm: integer("scheduled_at_km"),
  extraDetail: text("extra_detail"),
  autoPay: boolean("auto_pay").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const serviceLogs = pgTable("service_logs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  provider: text("provider").notNull(),
  odometerKm: integer("odometer_km").notNull(),
  cost: real("cost").notNull().default(0),
  receiptVerified: boolean("receipt_verified").notNull().default(false),
  notes: text("notes"),
  category: text("category").notNull().default("Service"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
