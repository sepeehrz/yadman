import { apiClient } from "@/lib/api";
import type {
  AuthUserDto,
  ForgotPasswordDto,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  RegisterRequest,
  SecurityQuestionDto,
} from "../types";

export async function login(input: LoginRequest): Promise<AuthUserDto> {
  const { data } = await apiClient.post<AuthUserDto>("/auth/login", input);
  return data;
}

export async function registerUser(
  input: RegisterRequest,
): Promise<AuthUserDto> {
  const { data } = await apiClient.post<AuthUserDto>("/auth/register", input);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function fetchCurrentUser(): Promise<AuthUserDto> {
  const { data } = await apiClient.get<AuthUserDto>("/auth/me");
  return data;
}

export async function fetchSecurityQuestion(
  username: string,
): Promise<SecurityQuestionDto> {
  const { data } = await apiClient.get<SecurityQuestionDto>(
    "/auth/security-question",
    { params: { username } },
  );
  return data;
}

export async function requestPasswordReset(
  input: ForgotPasswordRequest,
): Promise<ForgotPasswordDto> {
  const { data } = await apiClient.post<ForgotPasswordDto>(
    "/auth/forgot-password",
    input,
  );
  return data;
}

export async function resetPassword(
  input: ResetPasswordRequest,
): Promise<void> {
  await apiClient.post("/auth/reset-password", input);
}
