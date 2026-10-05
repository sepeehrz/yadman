import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/database/db";
import { vehicles } from "@/database/schema/garage";
import {
  getAuthenticatedUserFromRequest,
  UNAUTHORIZED_MESSAGE,
  type AuthenticatedUser,
} from "@/lib/auth";

export function ok<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 500): NextResponse<{ message: string }> {
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

/**
 * خودروی متعلق به کاربر جاری را برمی‌گرداند؛ مالکیت خودرو شرط دسترسی به
 * تمام منابع فرعی (بیمه، عوارض، سرویس) است.
 */
export async function getOwnedVehicle(userId: string, vehicleId: string) {
  const [row] = await getDb()
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, userId)))
    .limit(1);
  return row ?? null;
}

export function handleRouteError(error: unknown): NextResponse<{ message: string }> {
  if (typeof error === "object" && error !== null && "code" in error) {
    if ((error as { code: string }).code === "23505") {
      return fail("این رکورد تکراری است (احتمالاً پلاک قبلاً ثبت شده)", 409);
    }
  }
  return fail("خطای سرور. لطفاً دوباره تلاش کنید", 500);
}
