"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLifeHub } from "@/store/LifeHubContext";
import { faNum } from "@/lib/format";

const TABS = [
  {
    href: "/",
    label: "داشبورد",
    icon: "dashboard",
    match: (p: string) => p === "/",
  },
  {
    href: "/vehicles",
    label: "خودرو",
    icon: "directions_car",
    match: (p: string) => p.startsWith("/vehicles"),
  },
  {
    href: "/loans",
    label: "وام‌ها",
    icon: "account_balance_wallet",
    match: (p: string) => p.startsWith("/loans"),
  },
  {
    href: "/tasks",
    label: "کارها",
    icon: "check_circle",
    match: (p: string) => p.startsWith("/tasks"),
  },
];

export function NavigationDock() {
  const pathname = usePathname();
  const { setQuickAddOpen, pendingTasksCount } = useLifeHub();

  const renderTab = (
    tab: (typeof TABS)[number],
    key: string,
    withBadge = false,
  ) => {
    const active = tab.match(pathname);
    return (
      <Link
        key={key}
        href={tab.href}
        aria-label={tab.label}
        className={`flex-1 flex flex-col items-center justify-center h-full transition-all ${
          active
            ? "text-[#4f46e5] font-bold scale-[1.03]"
            : "text-[#545f73] hover:text-[#0b1c30]"
        }`}
      >
        <span className="relative">
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
          >
            {tab.icon}
          </span>
          {withBadge && pendingTasksCount > 0 && (
            <span className="absolute -top-1 -left-2 px-1 text-[9px] font-bold rounded-full bg-[#ba1a1a] text-white">
              {faNum(pendingTasksCount)}
            </span>
          )}
        </span>
        <span className="text-[11px] font-semibold tracking-tight mt-0.5">
          {tab.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-safe">
      <nav className="pointer-events-auto max-w-md mx-auto mx-4 mb-4 sm:mb-5 h-16 rounded-[24px] bg-white/95 backdrop-blur-xl shadow-[0_12px_32px_-4px_rgba(11,28,48,0.12)] border border-[#e2e8f0]/60 flex items-center justify-around px-2 relative">
        {renderTab(TABS[0], "dashboard")}
        {renderTab(TABS[1], "vehicles")}

        <div className="flex-1 flex items-center justify-center relative">
          <button
            onClick={() => setQuickAddOpen(true)}
            aria-label="ایجاد مورد جدید"
            className="w-12 h-12 -mt-6 rounded-full bg-[#4f46e5] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(79,70,229,0.38)] hover:bg-[#3525cd] active:scale-95 transition-all ring-4 ring-white"
          >
            <span className="material-symbols-outlined text-[26px]">add</span>
          </button>
        </div>

        {renderTab(TABS[2], "loans")}
        {renderTab(TABS[3], "tasks", true)}
      </nav>
    </div>
  );
}
