import { eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { users } from "@/database/schema/users";
import { changePasswordRequestSchema } from "@/features/profile/validations/profile-schema";
import {
  getAuthenticatedUserFromRequest,
  hashSecret,
  UNAUTHORIZED_MESSAGE,
  verifySecret,
} from "@/lib/auth";
import {
  fail,
  handleRouteError,
  ok,
} from "@/utils/server-helpers/route-helpers";

export async function PATCH(request: Request) {
  try {
    const authUser = getAuthenticatedUserFromRequest(request);
    if (!authUser) {
      return fail(UNAUTHORIZED_MESSAGE, 401);
    }
    const body: unknown = await request.json();
    const parsed = changePasswordRequestSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات تغییر رمز معتبر نیست", 422);
    }
    const db = getDb();
    const [row] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, authUser.userId))
      .limit(1);
    if (!row) {
      return fail(UNAUTHORIZED_MESSAGE, 401);
    }
    const currentMatches = await verifySecret(
      parsed.data.currentPassword,
      row.passwordHash,
    );
    if (!currentMatches) {
      return fail("رمز عبور فعلی اشتباه است", 401);
    }
    await db
      .update(users)
      .set({
        passwordHash: await hashSecret(parsed.data.newPassword),
        updatedAt: new Date(),
      })
      .where(eq(users.id, authUser.userId));
    return ok({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
