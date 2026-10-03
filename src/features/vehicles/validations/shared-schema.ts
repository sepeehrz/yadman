import { z } from "zod";

export const isoDateSchema = z
  .string()
  .min(1, "تاریخ الزامی است")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "قالب تاریخ معتبر نیست (مثل ۱۴۰۳-۰۸-۰۵)");

export const optionalIsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "قالب تاریخ معتبر نیست")
  .optional()
  .or(z.literal("").transform(() => undefined));

export type FieldErrors = Record<string, string>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const fields: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!(key in fields)) {
      fields[key] = issue.message;
    }
  }
  return fields;
}
