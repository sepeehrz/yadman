import type { LoginRequest } from "../validations/login-schema";
import type { RegisterRequest } from "../validations/register-schema";
import type {
  ForgotPasswordRequest,
} from "../validations/forgot-password-schema";
import type {
  ResetPasswordRequest,
} from "../validations/reset-password-schema";

export type Gender = "male" | "female";

/** کاربر بدون اطلاعات حساس (بدون هش‌ها) */
export interface AuthUserDto {
  id: string;
  username: string;
  name: string;
  lastName: string;
  gender: Gender;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityQuestionDto {
  securityQuestion: string;
}

export interface ForgotPasswordDto {
  resetToken: string;
  expiresInSeconds: number;
}

export type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
};
