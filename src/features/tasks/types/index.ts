export type ReminderPriority = "low" | "normal" | "high";

export type ReminderRecurrence =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

/** بازه‌های زمانی دسته‌بندی یادآورها — به‌ترتیب پیشرونده و بدون هم‌پوشانی */
export type ReminderPeriod = "today" | "week" | "month" | "year" | "later";

/** فیلترهای قابل انتخاب در UI — «later» فقط در «همه» دیده می‌شود */
export type ReminderFilter = "all" | Exclude<ReminderPeriod, "later">;

export interface Reminder {
  id: string;
  title: string;
  description: string | null;
  /** موعد اصلی یادآور (ISO) */
  dueAt: string;
  /** در صورت Snooze، موعد مؤثر اعلان به این زمان جابه‌جا شده است (ISO) */
  snoozedUntil: string | null;
  priority: ReminderPriority;
  recurrence: ReminderRecurrence;
  done: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderInput {
  title: string;
  description?: string;
  dueAt: string;
  priority: ReminderPriority;
  recurrence: ReminderRecurrence;
}

export interface UpdateReminderInput {
  title?: string;
  description?: string;
  dueAt?: string;
  priority?: ReminderPriority;
  recurrence?: ReminderRecurrence;
  done?: boolean;
  /** به تعویق انداختن اعلان به‌اندازه این تعداد دقیقه — سرور موعد مؤثر را جابه‌جا می‌کند */
  snoozeMinutes?: number;
}

export interface ChecklistItem {
  id: string;
  packId: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  subtitle: string | null;
  icon: string;
  active: boolean;
  items: ChecklistItem[];
}

export interface CreateChecklistInput {
  title: string;
  items: string[];
}

export interface CreateChecklistItemInput {
  text: string;
}

export interface UpdateChecklistItemInput {
  completed: boolean;
}
