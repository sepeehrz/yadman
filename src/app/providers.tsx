"use client";

import type { ReactNode } from "react";
import { LifeHubProvider } from "@/store/LifeHubContext";
import { AppShell } from "@/components/layout/AppShell";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LifeHubProvider>
      <AppShell>{children}</AppShell>
    </LifeHubProvider>
  );
}
