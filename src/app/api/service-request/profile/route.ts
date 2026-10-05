import { eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { users } from "@/database/schema/users";
import { profileUpdateRequestSchema } from "@/features/profile/validations/profile-schema";
import {
  getAuthenticatedUserFromRequest,
  UNAUTHORIZED_MESSAGE,
} from "@/lib/auth";
import {
  fail,
  handleRouteError,
  ok,
} from "@/app/api/service-request/route-helpers";
import { mapUserToDto } from "../user-mapper";

export async function GET(request: Request) {
  try {
    const authUser = getAuthenticatedUserFromRequest(request);
    if (!authUser) {
      return fail(UNAUTHORIZED_MESSAGE, 401);
    }
    const [row] = await getDb()
      .select()
      .from(users)
      .where(eq(users.id, authUser.userId))
      .limit(1);
    if (!row) {
      return fail(UNAUTHORIZED_MESSAGE, 401);
    }
    return ok(mapUserToDto(row));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const authUser = getAuthenticatedUserFromRequest(request);
    if (!authUser) {
      return fail(UNAUTHORIZED_MESSAGE, 401);
    }
    const body: unknown = await request.json();
    const parsed = profileUpdateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات پروفایل معتبر نیست", 422);
    }
    const [row] = await getDb()
      .update(users)
      .set({
        name: parsed.data.name,
        lastName: parsed.data.lastName,
        gender: parsed.data.gender,
        updatedAt: new Date(),
      })
      .where(eq(users.id, authUser.userId))
      .returning();
    if (!row) {
      return fail("کاربر پیدا نشد", 404);
    }
    return ok(mapUserToDto(row));
  } catch (error) {
    return handleRouteError(error);
  }
}
