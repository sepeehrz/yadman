"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BaseDialog } from "@/components/ui/dialog";
import { useLifeHub } from "@/store/LifeHubContext";
import { AppIcon } from "@/components/ui/app-icon";
import { useTrackers } from "@/features/vehicles/hooks/use-trackers";
import { useLoans } from "@/features/loans/hooks/use-loans";
import { useReminders } from "@/features/tasks/hooks/use-reminders";
import { useTimeline } from "@/features/dashboard/hooks/use-timeline";
import { usd } from "@/lib/format";

interface SearchableEntry {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  badge: string;
}

/** جست‌وجوی سراسری روی داده‌های کاربر جاری از حافظه کوئری */
export function SearchModal() {
  const { isSearchOpen, setSearchOpen } = useLifeHub();
  const { data: trackers = [] } = useTrackers();
  const { data: loans = [] } = useLoans();
  const { data: reminders = [] } = useReminders();
  const { data: timeline = [] } = useTimeline();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const onClose = () => setSearchOpen(false);
  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  const q = query.toLowerCase().trim();

  const results: SearchableEntry[] = q
    ? [
        ...trackers.map((t) => ({
          id: `tracker-${t.id}`,
          title: t.title,
          subtitle: t.subtitle,
          icon: t.icon,
          href: "/vehicles",
          badge: t.badgeText,
        })),
        ...loans.map((l) => ({
          id: `loan-${l.id}`,
          title: l.title,
          subtitle: `${l.bank} • ${usd(l.monthlyAmount)}/ماه`,
          icon: l.icon,
          href: "/loans",
          badge: `${usd(l.remainingAmount)} مانده`,
        })),
        ...reminders.map((r) => ({
          id: `reminder-${r.id}`,
          title: r.title,
          subtitle: new Date(r.dueAt).toLocaleString("fa-IR"),
          icon: r.done ? "check_circle" : "radio_button_unchecked",
          href: "/tasks",
          badge: r.done ? "انجام شد" : "در انتظار",
        })),
        ...timeline.map((tl) => ({
          id: `timeline-${tl.id}`,
          title: tl.title,
          subtitle: tl.subtitle,
          icon: tl.icon,
          href: "/",
          badge: tl.timeLabel,
        })),
      ].filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          entry.subtitle.toLowerCase().includes(q),
      )
    : [];

  return (
    <BaseDialog
      open={isSearchOpen}
      onClose={onClose}
      title="جست‌وجو"
      size="lg"
      align="top"
    >
      <div className="bg-card rounded-t-[28px] sm:rounded-2xl border border-border overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-3 sm:p-4 border-b border-border flex items-center gap-3 bg-background">
          <AppIcon name="search" className="text-muted-foreground size-[22px]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جست‌وجوی کارها، سرویس‌ها، وام‌ها..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="پاک‌کردن جست‌وجو"
              className="w-6 h-6 rounded-full bg-primary/10 text-muted-foreground flex items-center justify-center text-xs"
            >
              ✕
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/10"
          >
            بستن
          </button>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto space-y-3 no-scrollbar">
          {!query && (
            <div className="py-6 text-center text-muted-foreground">
              <AppIcon
                name="manage_search"
                className="size-[32px] text-muted-foreground mb-1"
              />
              <p className="text-xs sm:text-sm font-medium">
                کلیدواژه‌ای بنویسید تا در همه هاب‌ها جست‌وجو شود
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                {["تسلا", "وام", "بیمه", "روغن"].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setQuery(hint)}
                    className="px-2.5 py-1 rounded-full bg-primary/5 text-[11px] font-semibold text-primary hover:bg-primary/10"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <p className="text-sm font-semibold text-foreground">
                موردی پیدا نشد
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                «تسلا»، «وام» یا «روغن» را امتحان کنید.
              </p>
            </div>
          )}

          {results.map((entry) => (
            <div
              key={entry.id}
              onClick={() => go(entry.href)}
              className="p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <AppIcon name={entry.icon} className="text-primary size-[20px]" />
                <div>
                  <div className="text-xs font-bold text-foreground">
                    {entry.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {entry.subtitle}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-card text-primary">
                {entry.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BaseDialog>
  );
}
