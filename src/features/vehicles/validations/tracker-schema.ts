import { z } from "zod";

const optionalKmSchema = z.coerce
  .number("کیلومتر باید عدد باشد")
  .int("کیلومتر باید عدد صحیح باشد")
  .min(0, "کیلومتر نمی‌تواند منفی باشد")
  .max(10_000_000, "کیلومتر معتبر نیست");

export const trackerFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "نام سرویس الزامی است")
    .max(120, "نام سرویس حداکثر ۱۲۰ کاراکتر است"),
  subtitle: z.string().trim().max(200, "توضیح حداکثر ۲۰۰ کاراکتر است"),
  icon: z.string().trim().max(60).optional(),
  currentKm: optionalKmSchema.optional(),
  targetKm: optionalKmSchema.optional(),
  intervalKm: z.coerce
    .number("دوره تناوب باید عدد باشد")
    .int("دوره تناوب باید عدد صحیح باشد")
    .min(1, "دوره تناوب باید مثبت باشد")
    .max(1_000_000, "دوره تناوب معتبر نیست")
    .optional(),
  intervalMonths: z.coerce
    .number("دوره ماه باید عدد باشد")
    .int("دوره ماه باید عدد صحیح باشد")
    .min(1, "دوره ماه باید مثبت باشد")
    .max(120, "دوره ماه معتبر نیست")
    .optional(),
  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "قالب تاریخ معتبر نیست")
    .optional()
    .or(z.literal("")),
  extraDetail: z.string().trim().max(200).optional(),
  autoPay: z.boolean().optional(),
});

export type TrackerFormValues = z.infer<typeof trackerFormSchema>;
/** ورودی خام فرم قبل از coerce */
export type TrackerFormInput = z.input<typeof trackerFormSchema>;

export const createTrackerSchema = trackerFormSchema;

export type CreateTrackerRequest = z.infer<typeof createTrackerSchema>;

export const updateTrackerSchema = z.object({
  title: trackerFormSchema.shape.title.optional(),
  subtitle: trackerFormSchema.shape.subtitle.optional(),
  icon: z.string().trim().max(60).optional(),
  currentKm: optionalKmSchema.optional(),
  targetKm: optionalKmSchema.optional(),
  intervalKm: trackerFormSchema.shape.intervalKm,
  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "قالب تاریخ معتبر نیست")
    .optional(),
  extraDetail: z.string().trim().max(200).optional(),
  autoPay: z.boolean().optional(),
});

export type UpdateTrackerRequest = z.infer<typeof updateTrackerSchema>;
