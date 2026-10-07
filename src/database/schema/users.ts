import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * کاربران یادمان — احراز هویت با username/password.
 * پاسخ سوال امنیتی هم مثل پسورد هش می‌شود تا لو رفتن دیتابیس آسیب‌پذیری نسازد.
 */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  lastName: text("last_name").notNull(),
  gender: text("gender").notNull(),
  securityQuestion: text("security_question").notNull(),
  securityAnswerHash: text("security_answer_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * توکن‌های یک‌بارمصرف ریست رمز عبور.
 * فقط هش توکن ذخیره می‌شود و اعتبار هر توکن ۱۵ دقیقه است.
 */
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("password_reset_tokens_user_id_idx").on(table.userId)],
);

/** ترجیحات سراسری هر کاربر — فعلاً کیلومتر شمارنده کلی */
export const userPreferences = pgTable("user_preferences", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  odometerKm: integer("odometer_km").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
