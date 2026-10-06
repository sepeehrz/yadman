"use client";

import type { ReactNode } from "react";
import { NotificationsProvider } from "@/features/notifications/providers/notifications-provider";
import { DialogProvider } from "./dialog-provider";

interface IProps {
  children: ReactNode;
}

/**
 * پرووایدرهای مخصوص پنل داخلی.
 *
 * این‌ها فقط در لایه‌ی `(app)` mount می‌شوند، چون NotificationsProvider با
 * کوئری‌های زنده‌ی یادآورها و سررسیدهای خودرو، سرویس‌های داخلی پنل را صدا
 * می‌زند و این سرویس‌ها نباید بیرون از پنل (صفحه‌های ورود/ثبت‌نام/بازیابی
 * رمز) اجرا شوند.
 *
 * ترتیب: NotificationsProvider بیرون از DialogProvider است، چون DialogProvider
 * بدنه‌ی دیالوگ را کنار children رندر می‌کند و اعلان‌سنتر به context اعلان‌ها
 * نیاز دارد.
 */
export function PanelProviders({ children }: IProps) {
  return (
    <NotificationsProvider>
      <DialogProvider>{children}</DialogProvider>
    </NotificationsProvider>
  );
}