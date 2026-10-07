import { z } from "zod";
import { optionalIsoDateSchema, toFieldErrors, type FieldErrors } from "./shared-schema";

export const createTollSchema = z.object({
  year: z.string().trim().min(1, "سال الزامی است").max(10),
  amount: z.coerce.number().min(0, "مبلغ نامعتبر است"),
  dueDate: optionalIsoDateSchema,
  notes: z.string().trim().max(1000).optional().default(""),
});

export const updateTollSchema = createTollSchema.partial().extend({
  paid: z.boolean().optional(),
  paidAt: z.string().trim().max(10).nullable().optional(),
});

export type CreateTollForm = z.infer<typeof createTollSchema>;

export function parseTollForm(
  input: unknown,
): { ok: true; data: CreateTollForm } | { ok: false; errors: FieldErrors } {
  const result = createTollSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return { ok: false, errors: toFieldErrors(result.error) };
}
