import { z } from "zod";
import { toFieldErrors, type FieldErrors } from "./shared-schema";

const checklistTitleSchema = z
  .string()
  .trim()
  .min(1, "نام چک‌لیست الزامی است")
  .max(80, "نام چک‌لیست حداکثر ۸۰ کاراکتر است");

const checklistItemTextSchema = z
  .string()
  .trim()
  .min(1, "متن قلم الزامی است")
  .max(120, "متن قلم حداکثر ۱۲۰ کاراکتر است");

/** بدنه API برای ایجاد چک‌لیست همراه با اقلام اولیه */
export const createChecklistSchema = z.object({
  title: checklistTitleSchema,
  items: z
    .array(checklistItemTextSchema)
    .min(1, "حداقل یک قلم به چک‌لیست اضافه کنید")
    .max(50, "حداکثر ۵۰ قلم مجاز است"),
});

/** بدنه API برای افزودن قلم جدید به چک‌لیست موجود */
export const createChecklistItemSchema = z.object({
  text: checklistItemTextSchema,
});

/** بدنه API برای تغییر وضعیت انجام یک قلم */
export const updateChecklistItemSchema = z.object({
  completed: z.boolean(),
});

export type CreateChecklistPayload = z.infer<typeof createChecklistSchema>;
export type CreateChecklistItemPayload = z.infer<
  typeof createChecklistItemSchema
>;
export type UpdateChecklistItemPayload = z.infer<
  typeof updateChecklistItemSchema
>;

/** فرم دیالوگ ساخت چک‌لیست — اقلام به‌صورت پویا اضافه می‌شوند */
export interface ChecklistForm {
  title: string;
  items: string[];
}

export function parseChecklistForm(
  input: unknown,
): { ok: true; data: CreateChecklistPayload } | { ok: false; errors: FieldErrors } {
  const result = createChecklistSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return { ok: false, errors: toFieldErrors(result.error) };
}

export function parseCreateChecklistItemPayload(
  input: unknown,
):
  | { ok: true; data: CreateChecklistItemPayload }
  | { ok: false; errors: FieldErrors } {
  const result = createChecklistItemSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return { ok: false, errors: toFieldErrors(result.error) };
}
