import type { users } from "@/database/schema/users";

export type UserRow = typeof users.$inferSelect;
