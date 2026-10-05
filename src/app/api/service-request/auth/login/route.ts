import { eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { users } from "@/database/schema/users";
import { loginRequestSchema } from "@/features/auth/validations/login-schema";
import {
  getAuthTokenExpiryDate,
  setAuthCookies,
  signAuthToken,
  verifySecret,
} from "@/lib/auth";
import {
  fail,
  handleRouteError,
  ok,
} from "@/app/api/service-request/route-helpers";
import { mapUserToDto } from "../../user-mapper";

const INVALID_CREDENTIALS_MESSAGE = "نام کاربری یا رمز عبور اشتباه است";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = loginRequestSchema.safeParse(body);
    if (!parsed.success) {
      return fail(INVALID_CREDENTIALS_MESSAGE, 401);
    }
    const username = parsed.data.username.toLowerCase();

    const [row] = await getDb()
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    // پیام یکسان برای «کاربر نبود» و «رمز اشتباه» تا نام کاربری حدس زده نشود
    if (!row) {
      return fail(INVALID_CREDENTIALS_MESSAGE, 401);
    }
    const passwordMatches = await verifySecret(
      parsed.data.password,
      row.passwordHash,
    );
    if (!passwordMatches) {
      return fail(INVALID_CREDENTIALS_MESSAGE, 401);
    }

    const token = signAuthToken({ userId: row.id, username: row.username });
    const response = ok(mapUserToDto(row));
    setAuthCookies(response, token, getAuthTokenExpiryDate());
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
