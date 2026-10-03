"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { NavigationDock } from "@/components/layout/NavigationDock";
import { Toast } from "@/components/ui/Toast";
import { ToastBridge } from "@/components/common/toast-bridge";
import { QuickAddModal } from "@/components/modals/QuickAddModal";
import { SearchModal } from "@/components/modals/SearchModal";
import { NotificationsModal } from "@/components/modals/NotificationsModal";
import { ProfileModal } from "@/components/modals/ProfileModal";
import { OdometerModal } from "@/components/modals/OdometerModal";
import { ScheduleServiceModal } from "@/components/modals/ScheduleServiceModal";
import { ROUTE_TITLES } from "@/lib/mock-data";

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
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col selection:bg-[#4f46e5]/15 selection:text-[#3525cd]">
      <Header title={title} />
      <main className="flex-1 w-full pt-16">{children}</main>
      <NavigationDock />

      <QuickAddModal />
      <SearchModal />
      <NotificationsModal />
      <ProfileModal />
      <OdometerModal />
      <ScheduleServiceModal />
      <Toast />
      <ToastBridge />
    </div>
  );
}
