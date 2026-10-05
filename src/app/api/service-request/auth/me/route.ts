import { eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { users } from "@/database/schema/users";
import { getAuthenticatedUserFromRequest, UNAUTHORIZED_MESSAGE } from "@/lib/auth";
import {
  fail,
  handleRouteError,
  ok,
} from "@/app/api/service-request/route-helpers";
import { mapUserToDto } from "../../user-mapper";

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
