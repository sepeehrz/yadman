import { boolean, integer, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

export const loans = pgTable("loans", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  bank: text("bank").notNull(),
  icon: text("icon").notNull().default("credit_card"),
  dueNotice: text("due_notice").notNull().default(""),
  dueDate: text("due_date").notNull().default(""),
  monthlyAmount: real("monthly_amount").notNull(),
  remainingAmount: real("remaining_amount").notNull(),
  totalAmount: real("total_amount").notNull(),
  paidInstallments: integer("paid_installments").notNull().default(0),
  totalInstallments: integer("total_installments").notNull().default(0),
  progressPercent: real("progress_percent").notNull().default(0),
  linkedAccount: text("linked_account"),
  autoPay: boolean("auto_pay").notNull().default(false),
  category: text("category").notNull().default("personal"),
  paidThisCycle: boolean("paid_this_cycle").notNull().default(false),
  badgeText: text("badge_text"),
  badgeType: text("badge_type"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
