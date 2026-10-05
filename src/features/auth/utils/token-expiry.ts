import { AUTH_EXP_COOKIE_NAME } from "@/lib/auth/auth-constants";

/** خواندن epoch ثانیه انقضای توکن از کوکی خوانا (فقط کلاینت) */
export function readTokenExpiryEpoch(): number | null {
  if (typeof document === "undefined") return null;
  for (const pair of document.cookie.split(";")) {
    const separatorIndex = pair.indexOf("=");
    if (separatorIndex === -1) continue;
    if (pair.slice(0, separatorIndex).trim() !== AUTH_EXP_COOKIE_NAME) {
      continue;
    }
    const value = Number.parseInt(pair.slice(separatorIndex + 1).trim(), 10);
    return Number.isFinite(value) ? value : null;
  }
  return null;
}
