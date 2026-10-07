import { z } from "zod";
import { isoDateSchema, optionalIsoDateSchema, toFieldErrors, type FieldErrors } from "./shared-schema";

export const createServiceSchema = z.object({
  title: z.string().trim().min(1, "نام سرویس الزامی است").max(120),
  categoryId: z.string().trim().max(60).nullable().optional(),
  serviceDate: isoDateSchema,
  provider: z.string().trim().max(120).optional().default(""),
  odometerKm: z.coerce.number().int("کیلومتر باید عدد صحیح باشد").min(0, "کیلومتر نامعتبر است"),
  cost: z.coerce.number().min(0, "هزینه نامعتبر است").optional().default(0),
  notes: z.string().trim().max(1000).optional().default(""),
  nextDueDate: optionalIsoDateSchema,
  nextDueKm: z.coerce.number().int().min(0).nullable().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceForm = z.infer<typeof createServiceSchema>;

export function parseServiceForm(
  input: unknown,
): { ok: true; data: CreateServiceForm } | { ok: false; errors: FieldErrors } {
  const result = createServiceSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return { ok: false, errors: toFieldErrors(result.error) };
}
