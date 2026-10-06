import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthSessionGuard } from "@/features/auth/components/auth-session-guard";
import { PanelProviders } from "@/providers/panel-providers";

/** صفحات داخلی — فقط برای کاربر لاگین‌کرده (کنترل در middleware) */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <PanelProviders>
      <AppShell>
        <AuthSessionGuard>{children}</AuthSessionGuard>
      </AppShell>
    </PanelProviders>
  );
}
