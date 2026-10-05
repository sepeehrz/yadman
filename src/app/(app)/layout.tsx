import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthSessionGuard } from "@/features/auth/components/auth-session-guard";

/** صفحات داخلی — فقط برای کاربر لاگین‌کرده (کنترل در middleware) */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <AuthSessionGuard>{children}</AuthSessionGuard>
    </AppShell>
  );
}
