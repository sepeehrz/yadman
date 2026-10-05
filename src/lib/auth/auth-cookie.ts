import type { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  AUTH_EXP_COOKIE_NAME,
} from "./auth-constants";

/**
 * کوکی توکن httpOnly + Secure (در پروداکشن) + SameSite=Lax است؛ جاوااسکریپت
 * کلاینت به مقدار آن دسترسی ندارد. تاریخ انقضا در کوکی دوم خوانا ذخیره می‌شود
 * تا کلاینت بتواند خروج خودکار را زمان‌بندی کند.
 */
function baseCookieOptions(expiresAt: Date) {
  return {
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  };
}

export function setAuthCookies(
  response: NextResponse,
  token: string,
  expiresAt: Date,
): void {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    ...baseCookieOptions(expiresAt),
    httpOnly: true,
  });
  response.cookies.set(AUTH_EXP_COOKIE_NAME, String(Math.floor(expiresAt.getTime() / 1000)), {
    ...baseCookieOptions(expiresAt),
    httpOnly: false,
  });
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 0,
  });
  response.cookies.set(AUTH_EXP_COOKIE_NAME, "", {
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
    maxAge: 0,
  });
}
