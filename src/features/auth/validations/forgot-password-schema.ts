import { z } from "zod";
import { securityAnswerSchema } from "./shared-schema";

export const forgotPasswordFormSchema = z.object({
  username: z.string().trim().min(1, "نام کاربری الزامی است"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

/** مرحله دوم فراموشی رمز — پاسخ سوال امنیتی */
export const securityAnswerFormSchema = z.object({
  securityAnswer: securityAnswerSchema,
});

export type SecurityAnswerFormValues = z.infer<
  typeof securityAnswerFormSchema
>;

export const forgotPasswordRequestSchema = z.object({
  username: z.string().trim().min(1, "نام کاربری الزامی است"),
  securityAnswer: securityAnswerSchema,
});

export type ForgotPasswordRequest = z.infer<
  typeof forgotPasswordRequestSchema
>;
