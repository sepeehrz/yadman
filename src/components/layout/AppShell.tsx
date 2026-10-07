"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { NavigationDock } from "@/components/layout/NavigationDock";
import { ROUTE_TITLES } from "@/constant";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title =
    ROUTE_TITLES[pathname] ??
    (pathname.startsWith("/vehicles")
      ? "خودروها"
      : pathname.startsWith("/loans")
        ? "وام‌ها و اقساط"
        : pathname.startsWith("/tasks")
          ? "کارها و لیست‌ها"
          : "داشبورد");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/15 selection:text-primary">
      <Header title={title} />
      <main className="flex-1 w-full pt-16">{children}</main>
      <NavigationDock />
      <Toaster />
    </div>
  );
}
