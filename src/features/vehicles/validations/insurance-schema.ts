import { z } from "zod";
import { isoDateSchema, toFieldErrors, type FieldErrors } from "./shared-schema";

export const insuranceTypeSchema = z.enum(["third-party", "body"]);

const insuranceBaseSchema = z.object({
  type: insuranceTypeSchema,
  company: z.string().trim().min(1, "شرکت بیمه الزامی است").max(120),
  policyNumber: z.string().trim().max(60).optional().default(""),
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  cost: z.coerce.number().min(0, "هزینه نامعتبر است").nullable().optional(),
  notes: z.string().trim().max(1000).optional().default(""),
});

export const createInsuranceSchema = insuranceBaseSchema.refine(
  (value) => value.endDate >= value.startDate,
  {
    message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
    path: ["endDate"],
  },
);

export const updateInsuranceSchema = insuranceBaseSchema.partial().refine(
  (value) => !value.startDate || !value.endDate || value.endDate >= value.startDate,
  {
    message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
    path: ["endDate"],
  },
);

export type CreateInsuranceForm = z.infer<typeof createInsuranceSchema>;

export function parseInsuranceForm(
  input: unknown,
): { ok: true; data: CreateInsuranceForm } | { ok: false; errors: FieldErrors } {
  const result = createInsuranceSchema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  return { ok: false, errors: toFieldErrors(result.error) };
}
