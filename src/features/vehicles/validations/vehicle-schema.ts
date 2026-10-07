import { z } from "zod";
import { toFieldErrors, type FieldErrors } from "./shared-schema";

export const createVehicleSchema = z.object({
  name: z.string().trim().min(1, "نام خودرو الزامی است").max(80, "نام خودرو طولانی است"),
  year: z.coerce.number().int("سال معتبر نیست").min(1300).max(2100).nullable().optional(),
  odometerKm: z.coerce.number().int().min(0, "کیلومتر نامعتبر است").optional().default(0),
  imageUrl: z.string().trim().max(500).optional().default(""),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleForm = z.infer<typeof createVehicleSchema>;

export function parseVehicleForm(
  input: unknown,
): { ok: true; data: CreateVehicleForm } | { ok: false; errors: FieldErrors } {
  const result = createVehicleSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return { ok: false, errors: toFieldErrors(result.error) };
}
