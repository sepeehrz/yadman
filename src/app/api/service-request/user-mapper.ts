import type { users } from "@/database/schema/users";
import type { AuthUserDto } from "@/features/auth/types";

type UserRow = typeof users.$inferSelect;

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
