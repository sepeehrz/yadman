import { z } from "zod";
import { toFieldErrors, type FieldErrors } from "./shared-schema";
import type { CreateReminderInput, Reminder } from "../types";

export const reminderPrioritySchema = z.enum(["low", "normal", "high"]);

export const reminderRecurrenceSchema = z.enum([
  "none",
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);

const isoDateSchema = z
  .string()
  .min(1, "تاریخ الزامی است")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "قالب تاریخ معتبر نیست");

const dueTimeSchema = z
  .string()
  .min(1, "ساعت الزامی است")
  .regex(/^\d{2}:\d{2}$/, "قالب ساعت معتبر نیست");

const isoDateTimeSchema = z
  .string()
  .min(1, "تاریخ و ساعت یادآور الزامی است")
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "قالب تاریخ و ساعت معتبر نیست")
  .refine(
    (value) => !Number.isNaN(new Date(value).getTime()),
    "تاریخ و ساعت معتبر نیست",
  );

const titleSchema = z
  .string()
  .trim()
  .min(1, "نام یادآور الزامی است")
  .max(120, "نام یادآور حداکثر ۱۲۰ کاراکتر است");

const descriptionSchema = z
  .string()
  .trim()
  .max(500, "توضیحات حداکثر ۵۰۰ کاراکتر است");

/** فرم دیالوگ یادآور — تاریخ و ساعت جداگانه گرفته می‌شود و در parse ترکیب می‌شوند */
export const reminderFormSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  dueDate: isoDateSchema,
  dueTime: dueTimeSchema,
  priority: reminderPrioritySchema,
  recurrence: reminderRecurrenceSchema,
});

export type ReminderForm = z.infer<typeof reminderFormSchema>;

/** بدنه API سمت سرور برای ایجاد یادآور */
export const createReminderSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional().default(""),
  dueAt: isoDateTimeSchema,
  priority: reminderPrioritySchema.optional().default("normal"),
  recurrence: reminderRecurrenceSchema.optional().default("none"),
});

/** بدنه API برای به‌روزرسانی جزئی — شامل toggle انجام‌شدن و Snooze */
export const updateReminderSchema = z.object({
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
  dueAt: isoDateTimeSchema.optional(),
  priority: reminderPrioritySchema.optional(),
  recurrence: reminderRecurrenceSchema.optional(),
  done: z.boolean().optional(),
  snoozeMinutes: z.coerce
    .number()
    .int("مدت تعویق معتبر نیست")
    .min(1, "مدت تعویق باید مثبت باشد")
    .max(60 * 24 * 30, "حداکثر تعویق ۳۰ روز است")
    .optional(),
});

export type CreateReminderPayload = z.infer<typeof createReminderSchema>;
export type UpdateReminderPayload = z.infer<typeof updateReminderSchema>;

export function reminderToForm(reminder: Reminder): ReminderForm {
  const due = new Date(reminder.dueAt);
  const pad = (value: number): string => `${value}`.padStart(2, "0");
  return {
    title: reminder.title,
    description: reminder.description ?? "",
    dueDate: `${due.getFullYear()}-${pad(due.getMonth() + 1)}-${pad(due.getDate())}`,
    dueTime: `${pad(due.getHours())}:${pad(due.getMinutes())}`,
    priority: reminder.priority,
    recurrence: reminder.recurrence,
  };
}

export function parseReminderForm(
  input: unknown,
): { ok: true; data: CreateReminderInput } | { ok: false; errors: FieldErrors } {
  const result = reminderFormSchema.safeParse(input);
  if (result.success) {
    const form = result.data;
    return {
      ok: true,
      data: {
        title: form.title,
        description: form.description || undefined,
        dueAt: `${form.dueDate}T${form.dueTime}:00`,
        priority: form.priority,
        recurrence: form.recurrence,
      },
    };
  }
  return { ok: false, errors: toFieldErrors(result.error) };
}

export function parseUpdateReminderPayload(
  input: unknown,
): { ok: true; data: UpdateReminderPayload } | { ok: false; errors: FieldErrors } {
  const result = updateReminderSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return { ok: false, errors: toFieldErrors(result.error) };
}
