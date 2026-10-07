import type { taskReminders } from "@/database/schema/tasks";

/** پارامترهای مسیر /api/reminders/[reminderId] */
export interface IReminderRouteParams {
  params: Promise<{ reminderId: string }>;
}

export type ReminderRow = typeof taskReminders.$inferSelect;
