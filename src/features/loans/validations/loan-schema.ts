import { z } from "zod";

export const loanCategorySchema = z.enum([
  "mortgage",
  "auto",
  "hardware",
  "personal",
]);

export const loanFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "عنوان وام الزامی است")
    .max(120, "عنوان وام حداکثر ۱۲۰ کاراکتر است"),
  bank: z
    .string()
    .trim()
    .min(1, "نام بانک الزامی است")
    .max(80, "نام بانک حداکثر ۸۰ کاراکتر است"),
  category: loanCategorySchema,
  monthlyAmount: z.coerce
    .number("مبلغ قسط باید عدد باشد")
    .positive("مبلغ قسط باید مثبت باشد")
    .max(1_000_000_000, "مبلغ قسط معتبر نیست"),
  remainingAmount: z.coerce
    .number("مانده وام باید عدد باشد")
    .min(0, "مانده وام نمی‌تواند منفی باشد")
    .max(1_000_000_000_000, "مانده وام معتبر نیست"),
  totalAmount: z.coerce
    .number("مبلغ کل باید عدد باشد")
    .min(0, "مبلغ کل نمی‌تواند منفی باشد")
    .max(1_000_000_000_000, "مبلغ کل معتبر نیست")
    .optional(),
  dueDay: z.coerce
    .number("روز سررسید باید عدد باشد")
    .int("روز سررسید باید عدد صحیح باشد")
    .min(1, "روز سررسید بین ۱ تا ۳۱ است")
    .max(31, "روز سررسید بین ۱ تا ۳۱ است"),
  autoPay: z.boolean(),
});

/** ورودی خام فرم قبل از coerce (مقادیر فرم HTML رشته/نامعلوم هستند) */

/** بدنه API ایجاد وام — فیلدهای مشتق (تعداد اقساط، پیشرفت و ...) در سرور محاسبه می‌شود */
export const createLoanSchema = loanFormSchema;

export type CreateLoanRequest = z.infer<typeof createLoanSchema>;

export const updateLoanSchema = z.object({
  title: loanFormSchema.shape.title.optional(),
  bank: loanFormSchema.shape.bank.optional(),
  category: loanCategorySchema.optional(),
  monthlyAmount: loanFormSchema.shape.monthlyAmount.optional(),
  remainingAmount: loanFormSchema.shape.remainingAmount.optional(),
  totalAmount: loanFormSchema.shape.totalAmount,
  dueDay: loanFormSchema.shape.dueDay.optional(),
  autoPay: z.boolean().optional(),
  paidThisCycle: z.boolean().optional(),
});

export type UpdateLoanRequest = z.infer<typeof updateLoanSchema>;
