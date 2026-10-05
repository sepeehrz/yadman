import { z } from "zod";
import { passwordSchema } from "./shared-schema";

/** فرم تعیین رمز جدید — تکرار رمز فقط در فرم اعتبارسنجی می‌شود */
export const resetPasswordFormSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export const resetPasswordRequestSchema = z.object({
  resetToken: z.string().min(10, "توکن بازیابی نامعتبر است"),
  newPassword: passwordSchema,
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
