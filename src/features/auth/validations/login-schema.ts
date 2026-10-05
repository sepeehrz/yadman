import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().trim().min(1, "نام کاربری الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

/** بدنه API ورود — نرمال‌سازی نام کاربری در سمت سرور انجام می‌شود */
export const loginRequestSchema = loginFormSchema;

export type LoginRequest = z.infer<typeof loginRequestSchema>;
