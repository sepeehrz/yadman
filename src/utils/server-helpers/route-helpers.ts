import { NextResponse } from "next/server";
import {
  getAuthenticatedUserFromRequest,
  UNAUTHORIZED_MESSAGE,
  type AuthenticatedUser,
} from "@/lib/auth";

/** پاسخ موفق JSON با کد وضعیت دلخواه */
export function ok<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

/** پاسخ خطای JSON با پیام فارسی */
export function fail(
  message: string,
  status = 500,
): NextResponse<{ message: string }> {
  return NextResponse.json({ message }, { status });
}

/** کاربر جاری از توکن JWT؛ در ناموفق بودن null برمی‌گردد */
export function getAuthorizedUser(request: Request): AuthenticatedUser | null {
  return getAuthenticatedUserFromRequest(request);
}

/** پاسخ استاندارد ۴۰۱ برای مسیرهای محافظت‌شده */
export function unauthorized(): NextResponse<{ message: string }> {
  return fail(UNAUTHORIZED_MESSAGE, 401);
}

/** نرمال‌سازی خطاهای روت‌های API به پاسخ استاندارد سرور */
export function handleRouteError(error: unknown): NextResponse<{ message: string }> {
  if (typeof error === "object" && error !== null && "code" in error) {
    if ((error as { code: string }).code === "23505") {
      return fail("این رکورد تکراری است (احتمالاً پلاک قبلاً ثبت شده)", 409);
    }
  }
  return fail("خطای سرور. لطفاً دوباره تلاش کنید", 500);
}

/** تبدیل تاریخ به رشته ISO — فرمت واحد پاسخ‌های API */
export function toIsoString(value: Date): string {
  return value.toISOString();
}
