import { z } from "zod";
import {
  genderSchema,
  lastNameSchema,
  nameSchema,
  passwordSchema,
} from "@/features/auth/validations/shared-schema";

export const profileUpdateFormSchema = z.object({
  name: nameSchema,
  lastName: lastNameSchema,
  gender: genderSchema,
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateFormSchema>;

export const profileUpdateRequestSchema = profileUpdateFormSchema;

export type ProfileUpdateRequest = z.infer<typeof profileUpdateRequestSchema>;

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

export const changePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
  newPassword: passwordSchema,
});

export type ChangePasswordRequest = z.infer<
  typeof changePasswordRequestSchema
>;
