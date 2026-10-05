import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const vehicles = pgTable(
  "vehicles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    brand: text("brand").notNull().default(""),
    model: text("model").notNull().default(""),
    year: integer("year"),
    color: text("color").notNull().default(""),
    plateNumber: text("plate_number").notNull().unique(),
    vin: text("vin"),
    fuelType: text("fuel_type").notNull().default("benzin"),
    odometerKm: integer("odometer_km").notNull().default(0),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("vehicles_user_id_idx").on(table.userId)],
);

export const serviceCategories = pgTable("service_categories", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").notNull().default("build"),
  defaultIntervalKm: integer("default_interval_km"),
  defaultIntervalMonths: integer("default_interval_months"),
});

export const insurances = pgTable("insurances", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("third-party"),
  company: text("company").notNull(),
  policyNumber: text("policy_number"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  cost: real("cost"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tolls = pgTable("tolls", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  year: text("year").notNull(),
  amount: real("amount").notNull(),
  paid: boolean("paid").notNull().default(false),
  paidAt: text("paid_at"),
  dueDate: text("due_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
