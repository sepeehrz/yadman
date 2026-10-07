import type { AuthUserDto } from "@/features/auth/types";
import type { UserRow } from "@/types/server-types";

/** تبدیل ردیف کاربر به DTO عمومی — هرگز هش‌ها منتشر نمی‌شوند */
export function mapUserToDto(user: UserRow): AuthUserDto {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    lastName: user.lastName,
    gender: user.gender === "female" ? "female" : "male",
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
