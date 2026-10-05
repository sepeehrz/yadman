import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const timelineEvents = pgTable(
  "timeline_events",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
  timeLabel: text("time_label").notNull(),
  dateBadge: text("date_badge").notNull(),
  category: text("category").notNull(),
  categoryLabel: text("category_label").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  icon: text("icon").notNull().default("event"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
},
  (table) => [index("timeline_events_user_id_idx").on(table.userId)],
);
