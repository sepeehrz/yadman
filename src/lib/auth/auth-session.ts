import { AUTH_COOKIE_NAME } from "./auth-constants";
import {
  verifyAuthToken,
  type AuthenticatedUser,
} from "./auth-token";

/** استخراج کاربر از هدر Cookie درخواست — برای Route Handler ها */
export function getAuthenticatedUserFromRequest(
  request: Request,
): AuthenticatedUser | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = readCookieValue(cookieHeader, AUTH_COOKIE_NAME);
  return verifyAuthToken(token);
}

function readCookieValue(cookieHeader: string, name: string): string | null {
  for (const pair of cookieHeader.split(";")) {
    const separatorIndex = pair.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = pair.slice(0, separatorIndex).trim();
    if (key !== name) continue;
    return pair.slice(separatorIndex + 1).trim() || null;
  }
  return null;
}
