"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/ui/app-icon";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { toast } from "@/components/common/toast";
import { useNotificationsContext } from "../providers/notifications-provider";
import { NotificationCard } from "./notification-card";

/**
 * اعلان‌سنتر به‌صورت دیالوگ اجرا می‌شود: هدر آن را با `openDialog` باز می‌کند
 * و خود DialogProvider میزبان BaseDialog است، پس این کامپوننت فقط محتوا را
 * رندر می‌کند و `closeDialog` را برای بستن می‌گیرد.
 */
export function NotificationsCenter({ closeDialog }: { closeDialog: () => void }) {
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    clearAll,
    registerOpened,
    enableBrowserNotifications,
    isLoading,
  } = useNotificationsContext();
  const router = useRouter();

  // باز شدن اعلان‌سنتر = کاربر اعلان‌های موجود را دیده است
  useEffect(() => {
    registerOpened();
  }, [registerOpened]);

  const handleSelect = (id: string, href: string) => {
    markRead(id);
    router.push(href);
    closeDialog();
  };

  const handleEnableBrowser = async () => {
    const granted = await enableBrowserNotifications();
    if (granted) {
      toast.success("نوتیفیکیشن مرورگر فعال شد");
    } else {
      toast.warning("اجازه‌ی نوتیفیکیشن مرورگر داده نشد");
    }
  };

  const browserSupported =
    typeof window !== "undefined" && "Notification" in window;
  const browserGranted =
    browserSupported && Notification.permission === "granted";

  return (
    <div className="bg-card rounded-t-[28px] sm:rounded-2xl border border-border overflow-hidden flex flex-col max-h-[85vh]">
      <div className="p-4 border-b border-border flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <AppIcon
            name={unreadCount > 0 ? "notifications_active" : "notifications"}
            className="text-primary size-[22px]"
          />
          <h3 className="font-bold text-base text-foreground">اعلان‌ها و هشدارها</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
              {unreadCount.toLocaleString("fa-IR")}
            </span>
          )}
        </div>
        <button
          onClick={closeDialog}
          aria-label="بستن اعلان‌ها"
          className="w-7 h-7 rounded-full bg-primary/10 text-muted-foreground flex items-center justify-center hover:bg-primary/10"
        >
          <AppIcon name="close" className="size-[16px]" />
        </button>
      </div>

      {isLoading ? (
        <div className="p-3">
          <LoadingSkeleton rows={3} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-3">
          <EmptyState
            icon="notifications"
            title="اعلانی وجود ندارد"
            hint="هر وقت موعد یک یادآور یا سررسید خودرو برسد، اینجا ثبت می‌شود."
          />
        </div>
      ) : (
        <div className="p-3 overflow-y-auto space-y-2.5">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onSelect={() => handleSelect(notification.id, notification.href)}
            />
          ))}
        </div>
      )}

      <div className="p-3 border-t border-border bg-background flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">
          {notifications.length > 0
            ? `${notifications.length.toLocaleString("fa-IR")} اعلان • ${unreadCount.toLocaleString("fa-IR")} خوانده‌نشده`
            : "همه سیستم‌ها پایدارند"}
        </span>
        <div className="flex items-center gap-3">
          {browserSupported && !browserGranted && (
            <button
              onClick={handleEnableBrowser}
              className="text-xs font-bold text-primary hover:underline"
            >
              فعال‌سازی نوتیفیکیشن مرورگر
            </button>
          )}
          {unreadCount > 0 && (
            <button
              onClick={() => {
                markAllRead();
                toast.success("همه اعلان‌ها خوانده شد");
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              علامت‌گذاری همه به‌عنوان خوانده‌شده
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => {
                clearAll();
                toast.success("اعلان‌ها پاک شد");
              }}
              aria-label="پاک کردن همه اعلان‌ها"
              className="text-destructive hover:underline"
            >
              <AppIcon name="delete" className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}