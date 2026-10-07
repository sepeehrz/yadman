import { eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { passwordResetTokens, users } from "@/database/schema/users";
import { forgotPasswordRequestSchema } from "@/features/auth/validations/forgot-password-schema";
import {
  generateOneTimeToken,
  hashOneTimeToken,
  PASSWORD_RESET_TTL_SECONDS,
  UNAUTHORIZED_MESSAGE,
  verifySecret,
} from "@/lib/auth";
import {
  fail,
  handleRouteError,
  ok,
} from "@/utils/server-helpers/route-helpers";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = forgotPasswordRequestSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات بازیابی معتبر نیست", 422);
    }
    const username = parsed.data.username.toLowerCase();
    const db = getDb();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (!user) {
      return fail("کاربری با این نام کاربری پیدا نشد", 404);
    }

    // پاسخ سوال امنیتی نرمال‌شده مقایسه می‌شود (ثبت‌نام هم همین‌طور هش کرده)
    const answerMatches = await verifySecret(
      parsed.data.securityAnswer.trim().toLowerCase(),
      user.securityAnswerHash,
    );
    if (!answerMatches) {
      return fail("پاسخ سوال امنیتی صحیح نیست", 401);
    }

    // توکن‌های قبلی استفاده‌نشده باطل می‌شوند (هر لحظه فقط یک توکن فعال)
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id));

    const resetToken = generateOneTimeToken();
    await db.insert(passwordResetTokens).values({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: hashOneTimeToken(resetToken),
      expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_SECONDS * 1000),
    });

    return ok({
      resetToken,
      expiresInSeconds: PASSWORD_RESET_TTL_SECONDS,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
