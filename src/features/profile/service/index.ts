import { apiClient } from "@/lib/api";
import type { ProfileDto } from "../types";
import type { ProfileUpdateRequest } from "../types";
import type { ChangePasswordRequest } from "../types";

export async function fetchProfile(): Promise<ProfileDto> {
  const { data } = await apiClient.get<ProfileDto>("/profile");
  return data;
}

export async function updateProfile(
  input: ProfileUpdateRequest,
): Promise<ProfileDto> {
  const { data } = await apiClient.patch<ProfileDto>("/profile", input);
  return data;
}

export async function changePassword(
  input: ChangePasswordRequest,
): Promise<void> {
  await apiClient.patch("/profile/password", input);
}
