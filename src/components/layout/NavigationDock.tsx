"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon } from "@/components/ui/app-icon";
import { toast } from "@/components/common/toast";

const TABS = [
  {
    href: "/",
    label: "داشبورد",
    icon: "dashboard",
    match: (p: string) => p === "/",
    enabled: true,
  },
  {
    href: "/vehicles",
    label: "خودرو",
    icon: "directions_car",
    match: (p: string) => p.startsWith("/vehicles"),
    enabled: true,
  },
  {
    href: "/loans",
    label: "وام‌ها",
    icon: "account_balance_wallet",
    match: (p: string) => p.startsWith("/loans"),
    enabled: false,
  },
  {
    href: "/tasks",
    label: "کارها",
    icon: "check_circle",
    match: (p: string) => p.startsWith("/tasks"),
    enabled: true,
  },
] as const;

const tabClassName = (active: boolean) =>
  `flex-1 flex flex-col items-center justify-center h-full transition-all ${
    active ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
  }`;

export function NavigationDock() {
  const pathname = usePathname();

  const iconWrapperClassName = (active: boolean) =>
    `flex items-center justify-center size-8 rounded-full transition-all ${
      active
        ? "bg-primary text-primary-foreground shadow-[0_6px_14px_var(--primary)]/35"
        : ""
    }`;

  const content = (tab: (typeof TABS)[number], active: boolean) => (
    <>
      <span className={iconWrapperClassName(active)}>
        <AppIcon
          name={tab.icon}
          className="size-[22px]"
          filled={active && tab.enabled}
        />
      </span>
      <span className="text-[11px] font-semibold tracking-tight mt-0.5">
        {tab.label}
      </span>
    </>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-safe">
      <nav className="pointer-events-auto max-w-md mx-auto mx-4 mb-4 sm:mb-5 h-16 rounded-[24px] bg-card/95 backdrop-blur-xl shadow-[0_12px_32px_-4px_var(--shadow-color)]/15 border border-border/60 flex items-center justify-around px-2 relative">
        {TABS.map((tab) => {
          const active = tab.match(pathname);

          if (!tab.enabled) {
            return (
              <button
                key={tab.href}
                type="button"
                onClick={() =>
                  toast.info(`بخش «${tab.label}» به‌زودی فعال می‌شود`)
                }
                aria-label={tab.label}
                className={tabClassName(active)}
              >
                {content(tab, active)}
              </button>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              className={tabClassName(active)}
            >
              {content(tab, active)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
