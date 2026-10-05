import type { AuthUserDto } from "@/features/auth/types";
import type { ChangePasswordRequest, ProfileUpdateRequest } from "../validations/profile-schema";

/** اطلاعات پروفایل کاربر جاری */
export type ProfileDto = AuthUserDto;

export type {
  ChangePasswordRequest,
  ProfileUpdateRequest,
};
