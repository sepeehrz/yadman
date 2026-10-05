import { getDb } from "@/database/db";
import { userPreferences } from "@/database/schema/users";
import { users } from "@/database/schema/users";
import { registerRequestSchema } from "@/features/auth/validations/register-schema";
import {
  getAuthTokenExpiryDate,
  hashSecret,
  setAuthCookies,
  signAuthToken,
} from "@/lib/auth";
import {
  fail,
  handleRouteError,
  ok,
} from "@/app/api/service-request/route-helpers";
import { mapUserToDto } from "../../user-mapper";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = registerRequestSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات ثبت‌نام معتبر نیست", 422);
    }
    const input = parsed.data;
    const username = input.username.toLowerCase();

    const passwordHash = await hashSecret(input.password);
    const securityAnswerHash = await hashSecret(
      input.securityAnswer.trim().toLowerCase(),
    );

    const [row] = await getDb()
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        username,
        passwordHash,
        name: input.name,
        lastName: input.lastName,
        gender: input.gender,
        securityQuestion: input.securityQuestion,
        securityAnswerHash,
      })
      .returning();

    // ترجیحات اولیه هر کاربر در زمان ثبت‌نام ساخته می‌شود
    await getDb()
      .insert(userPreferences)
      .values({ userId: row.id, odometerKm: 0 })
      .onConflictDoNothing();

    const token = signAuthToken({ userId: row.id, username: row.username });
    const response = ok(mapUserToDto(row), 201);
    setAuthCookies(response, token, getAuthTokenExpiryDate());
    return response;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "23505"
    ) {
      return fail("این نام کاربری قبلاً گرفته شده است", 409);
    }
    return handleRouteError(error);
  }
}
