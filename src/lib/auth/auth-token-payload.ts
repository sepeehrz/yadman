/**
 * خواندن payload توکن JWT بدون بررسی امضا — فقط برای تصمیم‌های UX (ریدایرکت و
 * خروج خودکار). امنیت واقعی همیشه با verifyAuthToken در سمت سرور تضمین می‌شود.
 *
 * این فایل باید بدون وابستگی به Node (Buffer / node:crypto) بماند تا در
 * middleware (Edge Runtime) قابل استفاده باشد.
 */

export interface AuthTokenPayload {
  /** userId کاربر (کلید subject در JWT) */
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
}

export function decodeAuthTokenPayload(
  token: string | undefined | null,
): AuthTokenPayload | null {
  if (!token) return null;
  const segments = token.split(".");
  if (segments.length !== 3) return null;
  try {
    const parsed = JSON.parse(
      base64UrlDecode(segments[1]),
    ) as Partial<AuthTokenPayload>;
    if (
      typeof parsed.sub !== "string" ||
      typeof parsed.username !== "string"
    ) {
      return null;
    }
    return {
      sub: parsed.sub,
      username: parsed.username,
      iat: typeof parsed.iat === "number" ? parsed.iat : undefined,
      exp: typeof parsed.exp === "number" ? parsed.exp : undefined,
    };
  } catch {
    return null;
  }
}

export function isTokenPayloadExpired(payload: AuthTokenPayload): boolean {
  if (payload.exp === undefined) return false;
  return payload.exp * 1000 <= Date.now();
}

function base64UrlDecode(segment: string): string {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return new TextDecoder().decode(
    Uint8Array.from(binary, (character) => character.charCodeAt(0)),
  );
}
