"use client";

import { ASSETS } from "@/constant";
import { AppLogo } from "@/components/common/app-logo";
import { useDialog } from "@/hooks/use-dialog";
import { NotificationsCenter } from "@/features/notifications/components/notifications-center";
import { useNotificationsContext } from "@/features/notifications/providers/notifications-provider";
import { AppIcon } from "@/components/ui/app-icon";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { UserProfile } from "@/components/common/user-profile";
import { User, User2 } from "lucide-react";

export function Header({ title }: { title: string }) {
  const { openDialog, closeDialog } = useDialog();
  const { unreadCount } = useNotificationsContext();
  function openProfileDialog() {
    openDialog(UserProfile, { closeDialog });
  }
  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-background/85 backdrop-blur-xl shadow-[0_1px_8px_var(--shadow-color)]/5 border-b border-border/40 transition-all">
      <div className="max-w-2xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <AppLogo className="h-8 w-8 rounded-lg" />
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-xl sm:text-[22px] text-foreground tracking-tight">
              یادمان
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => openDialog(NotificationsCenter)}
            aria-label="مشاهده اعلان‌ها"
            className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 active:scale-95 transition-all relative"
          >
            <AppIcon
              name={unreadCount > 0 ? "notifications_active" : "notifications"}
              className="size-5.5"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center ring-2 ring-background">
                {unreadCount > 99 ? "۹۹+" : unreadCount.toLocaleString("fa-IR")}
              </span>
            )}
          </button>

          <ThemeToggle />

          <button
            onClick={openProfileDialog}
            aria-label="باز کردن پروفایل"
            className="ml-1 p-0.5 rounded-full ring-2 ring-transparent hover:ring-primary/40 focus:ring-primary transition-all active:scale-95"
          >
            <User className="" />
          </button>
        </div>
      </div>
    </header>
  );
}
