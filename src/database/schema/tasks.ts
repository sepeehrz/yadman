import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * یادآورهای کاربر — مدل سرویس‌محور.
 * dueAt مبنای فیلترهای زمانی است و snoozedUntil موعد مؤثر اعلان را جابه‌جا می‌کند.
 */
export const taskReminders = pgTable(
  "task_reminders",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
    priority: text("priority").notNull().default("normal"),
    recurrence: text("recurrence").notNull().default("none"),
    snoozedUntil: timestamp("snoozed_until", { withTimezone: true }),
    done: boolean("done").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("task_reminders_due_at_idx").on(table.dueAt)],
);

export const checklistPacks = pgTable("checklist_packs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  icon: text("icon").notNull().default("checklist"),
  active: boolean("active").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const checklistItems = pgTable(
  "checklist_items",
  {
    id: text("id").primaryKey(),
    packId: text("pack_id")
      .notNull()
      .references(() => checklistPacks.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("checklist_items_pack_id_idx").on(table.packId)],
);
