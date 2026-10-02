import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const taskReminders = pgTable("task_reminders", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  dueTime: text("due_time").notNull(),
  dueDateCategory: text("due_date_category").notNull().default("today"),
  priority: text("priority"),
  category: text("category").notNull().default("work"),
  source: text("source"),
  location: text("location"),
  recurring: text("recurring"),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const checklistPacks = pgTable("checklist_packs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  icon: text("icon").notNull().default("checklist"),
  active: boolean("active").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const checklistItems = pgTable("checklist_items", {
  id: text("id").primaryKey(),
  packId: text("pack_id")
    .notNull()
    .references(() => checklistPacks.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
