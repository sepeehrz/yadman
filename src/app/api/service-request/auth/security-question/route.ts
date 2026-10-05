import { eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { users } from "@/database/schema/users";
import { UNAUTHORIZED_MESSAGE } from "@/lib/auth";
import {
  fail,
  handleRouteError,
  ok,
} from "@/app/api/service-request/route-helpers";

export async function GET(request: Request) {
  try {
    const username =
      new URL(request.url).searchParams.get("username")?.trim() ?? "";
    if (!username) {
      return fail("نام کاربری الزامی است", 422);
    }
    const [row] = await getDb()
      .select({ securityQuestion: users.securityQuestion })
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .limit(1);
    if (!row) {
      return fail("کاربری با این نام کاربری پیدا نشد", 404);
    }
    return ok({ securityQuestion: row.securityQuestion });
  } catch (error) {
    return handleRouteError(error);
  }
}
