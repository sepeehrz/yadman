import jwt from "jsonwebtoken";
import { AUTH_TOKEN_TTL_SECONDS } from "./auth-constants";
import type { AuthTokenPayload } from "./auth-token-payload";

export interface AuthenticatedUser {
  userId: string;
  username: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET تنظیم نشده یا بیش از حد کوتاه است. آن را در فایل .env قرار دهید.",
    );
  }
  return secret;
}

/** امضای توکن JWT با اعتبار ۳۰ روز — sub برابر userId کاربر است */
export function signAuthToken(user: AuthenticatedUser): string {
  return jwt.sign({ username: user.username }, getJwtSecret(), {
    subject: user.userId,
    expiresIn: AUTH_TOKEN_TTL_SECONDS,
  });
}

/** بررسی امضا و اعتبار توکن؛ در ناموفق بودن null برمی‌گردد (بدون افشای جزئیات) */
export function verifyAuthToken(
  token: string | undefined | null,
): AuthenticatedUser | null {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload === "string") return null;
    const { sub, username } = payload as jwt.JwtPayload & {
      username?: unknown;
    };
    if (typeof sub !== "string" || typeof username !== "string") return null;
    return { userId: sub, username };
  } catch {
    return null;
  }
}

export function getTokenPayload(token: string): AuthTokenPayload | null {
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload === "string") return null;
    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}

/** تاریخ انقضای توکن تازه برای پرچم expires کوکی */
export function getAuthTokenExpiryDate(): Date {
  return new Date(Date.now() + AUTH_TOKEN_TTL_SECONDS * 1000);
}
