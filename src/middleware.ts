import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/auth-constants";
import {
  decodeAuthTokenPayload,
  isTokenPayloadExpired,
} from "@/lib/auth/auth-token-payload";

/**
 * مسیرهای عمومی (بدون نیاز به لاگین). بقیه مسیرهای صفحه فقط برای کاربر
 * لاگین‌کرده با توکن معتبر باز می‌شوند.
 */
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
] as const;

function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = decodeAuthTokenPayload(token);
  const hasToken = token !== undefined;
  const isExpired = payload !== null && isTokenPayloadExpired(payload);
  const isAuthenticated = payload !== null && !isExpired;

  // کاربر لاگین‌کرده نباید به صفحات لاگین/ثبت‌نام برگردد
  if (isAuthenticated && isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthenticated || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  const response = NextResponse.redirect(loginUrl);

  if (hasToken && isExpired) {
    // توکن منقضی شده — خروج خودکار با پیام انقضا و پاک‌کردن کوکی
    loginUrl.searchParams.set("expired", "1");
    response.cookies.delete(AUTH_COOKIE_NAME);
    return NextResponse.redirect(loginUrl);
  }

  // مسیر مقصد برای بازگشت پس از لاگین (فقط مسیر داخلی)
  if (pathname !== "/" || search) {
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|webmanifest)$).*)",
  ],
};
