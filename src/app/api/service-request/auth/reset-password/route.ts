import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/database/db";
import { passwordResetTokens, users } from "@/database/schema/users";
import { resetPasswordRequestSchema } from "@/features/auth/validations/reset-password-schema";
import {
  clearAuthCookies,
  hashOneTimeToken,
  hashSecret,
  UNAUTHORIZED_MESSAGE,
} from "@/lib/auth";
import {
  fail,
  handleRouteError,
  ok,
} from "@/app/api/service-request/route-helpers";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = resetPasswordRequestSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات تعیین رمز معتبر نیست", 422);
    }
    const db = getDb();
    const tokenHash = hashOneTimeToken(parsed.data.resetToken);

    const [tokenRow] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, new Date()),
        ),
      )
      .limit(1);
    if (!tokenRow) {
      return fail("توکن بازیابی نامعتبر یا منقضی شده است", 401);
    }

    const passwordHash = await hashSecret(parsed.data.newPassword);
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, tokenRow.userId));

    // توکن یک‌بارمصرف علامت‌گذاری می‌شود و نشست‌های قبلی با پاک‌کردن کوکی بی‌اعتبار می‌شوند
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, tokenRow.id));

    const response = ok({ success: true });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
