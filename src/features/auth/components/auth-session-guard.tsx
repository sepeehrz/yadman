"use client";

import type { ReactNode } from "react";
import { useAuthExpiry } from "../hooks/use-auth-expiry";

/** فعال‌سازی خروج خودکار هنگام انقضای توکن برای همه صفحات داخلی */
export function AuthSessionGuard({ children }: { children: ReactNode }) {
  useAuthExpiry();
  return <>{children}</>;
}
