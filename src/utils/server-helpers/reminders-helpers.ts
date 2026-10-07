import type {
  Reminder,
  ReminderPriority,
  ReminderRecurrence,
} from "@/features/tasks/types";
import { toIsoString } from "@/utils/server-helpers/route-helpers";
import type { ReminderRow } from "@/types/server-types";

const PRIORITIES: readonly ReminderPriority[] = ["low", "normal", "high"];
const RECURRENCES: readonly ReminderRecurrence[] = [
  "none",
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

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
    dueAt: toIsoString(row.dueAt),
    snoozedUntil: row.snoozedUntil ? toIsoString(row.snoozedUntil) : null,
    priority: normalizePriority(row.priority),
    recurrence: normalizeRecurrence(row.recurrence),
    done: row.done,
    completedAt: row.completedAt ? toIsoString(row.completedAt) : null,
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  };
}
