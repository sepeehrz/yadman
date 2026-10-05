import { z } from "zod";
import { SECURITY_QUESTIONS } from "../utils/security-questions";
import {
  acceptTermsSchema,
  genderSchema,
  lastNameSchema,
  nameSchema,
  passwordSchema,
  securityAnswerSchema,
  usernameSchema,
} from "./shared-schema";

const securityQuestionFormSchema = z
  .string()
  .min(1, "انتخاب سوال امنیتی الزامی است");

/**
 * فرم ثبت‌نام — username, password, name, lastName, gender + سوال امنیتی
 * برای جریان بازیابی رمز + تیک اجباری پذیرش قوانین و مقررات.
 */
export const registerFormSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
    name: nameSchema,
    lastName: lastNameSchema,
    gender: genderSchema,
    securityQuestion: securityQuestionFormSchema,
    securityAnswer: securityAnswerSchema,
    acceptTerms: acceptTermsSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

/** بدنه API ثبت‌نام — سوال امنیتی باید از لیست مجاز باشد */
export const registerRequestSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  name: nameSchema,
  lastName: lastNameSchema,
  gender: genderSchema,
  securityQuestion: z.enum(SECURITY_QUESTIONS, {
    message: "سوال امنیتی معتبر نیست",
  }),
  securityAnswer: securityAnswerSchema,
  acceptTerms: acceptTermsSchema,
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
