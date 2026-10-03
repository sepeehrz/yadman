"use client";

import type { ReactNode } from "react";
import { LifeHubProvider } from "@/store/LifeHubContext";
import { AppShell } from "@/components/layout/AppShell";
import { ReactQueryProvider } from "@/providers/react-query-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <LifeHubProvider>
        <AppShell>{children}</AppShell>
      </LifeHubProvider>
    </ReactQueryProvider>
  );
}
