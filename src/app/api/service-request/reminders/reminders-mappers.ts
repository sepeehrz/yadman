import type {
  Reminder,
  ReminderPriority,
  ReminderRecurrence,
} from "@/features/tasks/types";
import type { taskReminders } from "@/database/schema/tasks";

type ReminderRow = typeof taskReminders.$inferSelect;

const PRIORITIES: readonly ReminderPriority[] = ["low", "normal", "high"];
const RECURRENCES: readonly ReminderRecurrence[] = [
  "none",
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

function iso(value: Date): string {
  return value.toISOString();
}

function normalizePriority(value: string): ReminderPriority {
  return PRIORITIES.includes(value as ReminderPriority)
    ? (value as ReminderPriority)
    : "normal";
}

function normalizeRecurrence(value: string): ReminderRecurrence {
  return RECURRENCES.includes(value as ReminderRecurrence)
    ? (value as ReminderRecurrence)
    : "none";
}

export function mapReminder(row: ReminderRow): Reminder {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueAt: iso(row.dueAt),
    snoozedUntil: row.snoozedUntil ? iso(row.snoozedUntil) : null,
    priority: normalizePriority(row.priority),
    recurrence: normalizeRecurrence(row.recurrence),
    done: row.done,
    completedAt: row.completedAt ? iso(row.completedAt) : null,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}
