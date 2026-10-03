import { startOfToday } from "@/utils";
import type {
  Checklist,
  Reminder,
  ReminderFilter,
  ReminderPeriod,
  ReminderPriority,
  ReminderRecurrence,
} from "../types";

/** هر صفحه از لیست فیلترشده ۱۰ آیتم نشان می‌دهد و مابقی با Show More بارگذاری می‌شود */
export const REMINDERS_PAGE_SIZE = 10;

export const PRIORITY_LABEL: Record<ReminderPriority, string> = {
  low: "کم",
  normal: "عادی",
  high: "فوری",
};

export const RECURRENCE_LABEL: Record<ReminderRecurrence, string> = {
  none: "",
  daily: "روزانه",
  weekly: "هفتگی",
  monthly: "ماهانه",
  yearly: "سالانه",
};

export const PERIOD_LABEL: Record<ReminderFilter, string> = {
  all: "همه",
  today: "امروز",
  week: "هفته آینده",
  month: "ماه آینده",
  year: "سال آینده",
};

/** موعد مؤثر اعلان — در صورت Snooze به زمان تعویق جابه‌جا می‌شود */
export function getEffectiveDueAt(reminder: Reminder): Date {
  return new Date(reminder.snoozedUntil ?? reminder.dueAt);
}

function startOfTomorrow(now: Date): Date {
  const start = startOfDate(now);
  start.setDate(start.getDate() + 1);
  return start;
}

function startOfDate(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function startOfDaysAfter(now: Date, days: number): Date {
  const start = startOfDate(now);
  start.setDate(start.getDate() + days + 1);
  return start;
}

/**
 * دسته‌بندی پیشرونده و بدون هم‌پوشانی:
 * امروز = موعد امروز و گذشته، هفته آینده = روزهای ۱ تا ۷،
 * ماه آینده = روزهای ۸ تا ۳۰، سال آینده = روزهای ۳۱ تا ۳۶۵، دورتر = بعد از آن.
 */
export function getReminderPeriod(
  reminder: Reminder,
  now: Date = new Date(),
): ReminderPeriod {
  const effective = getEffectiveDueAt(reminder);
  if (effective.getTime() < startOfTomorrow(now).getTime()) {
    return "today";
  }
  if (effective.getTime() < startOfDaysAfter(now, 7).getTime()) {
    return "week";
  }
  if (effective.getTime() < startOfDaysAfter(now, 30).getTime()) {
    return "month";
  }
  if (effective.getTime() < startOfDaysAfter(now, 365).getTime()) {
    return "year";
  }
  return "later";
}

export function filterReminders(
  reminders: Reminder[],
  filter: ReminderFilter,
  now: Date = new Date(),
): Reminder[] {
  if (filter === "all") {
    return reminders;
  }
  return reminders.filter(
    (reminder) =>
      !reminder.done && getReminderPeriod(reminder, now) === filter,
  );
}

export function searchReminders(
  reminders: Reminder[],
  query: string,
): Reminder[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return reminders;
  }
  return reminders.filter(
    (reminder) =>
      reminder.title.toLowerCase().includes(normalized) ||
      (reminder.description ?? "").toLowerCase().includes(normalized),
  );
}

export function isReminderOverdue(
  reminder: Reminder,
  now: Date = new Date(),
): boolean {
  return !reminder.done && getEffectiveDueAt(reminder) < startOfToday();
}

/** انجام‌نشده‌ها بر اساس موعد مؤثر صعودی، انجام‌شده‌ها در انتهای لیست */
export function sortReminders(reminders: Reminder[]): Reminder[] {
  return [...reminders].sort((a, b) => {
    if (a.done !== b.done) {
      return a.done ? 1 : -1;
    }
    if (a.done && b.done) {
      return getEffectiveDueAt(b).getTime() - getEffectiveDueAt(a).getTime();
    }
    return getEffectiveDueAt(a).getTime() - getEffectiveDueAt(b).getTime();
  });
}

export function paginateReminders(
  reminders: Reminder[],
  visibleCount: number,
): Reminder[] {
  return reminders.slice(0, visibleCount);
}

export function countRemindersByFilter(
  reminders: Reminder[],
  now: Date = new Date(),
): Record<ReminderFilter, number> {
  const counts: Record<ReminderFilter, number> = {
    all: reminders.length,
    today: 0,
    week: 0,
    month: 0,
    year: 0,
  };
  for (const reminder of reminders) {
    if (reminder.done) {
      continue;
    }
    const period = getReminderPeriod(reminder, now);
    if (period !== "later") {
      counts[period] += 1;
    }
  }
  return counts;
}

export interface ChecklistProgress {
  completedCount: number;
  totalCount: number;
  percent: number;
}

export function getChecklistProgress(checklist: Checklist): ChecklistProgress {
  const totalCount = checklist.items.length;
  const completedCount = checklist.items.filter((item) => item.completed).length;
  const percent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  return { completedCount, totalCount, percent };
}

export function filterChecklists(checklists: Checklist[], query: string): Checklist[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return checklists;
  }
  return checklists.filter(
    (checklist) =>
      checklist.title.toLowerCase().includes(normalized) ||
      checklist.items.some((item) =>
        item.text.toLowerCase().includes(normalized),
      ),
  );
}
