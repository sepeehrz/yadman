"use client";

import { useEffect } from "react";
import { toast } from "@/components/common/toast";
import type { StoredNotification } from "../types";

const LAST_PUSHED_KEY = "lifehub_notifications_last_pushed";

/** ارسال یک اعلان واحد به سیستم‌عامل */
export function pushBrowserNotification(
  notification: StoredNotification,
): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    const browserNotification = new Notification(notification.title, {
      body: notification.body,
      tag: notification.id,
    });
    browserNotification.onclick = () => {
      window.focus();
      browserNotification.close();
    };
  } catch {
    // بعضی مرورگرها ساخت Notification را بدون سرویس‌ورکر ممنوع می‌کنند
    toast.info(notification.title);
  }
}

/**
 * نوتیفیکیشن سیستم‌عاملی مرورگر.
 * تنها یک اعلان تازه در هر نشست ارسال می‌شود تا با هر بار mount شدن اپ
 * پیام تکراری دیده نشود. اگر دسترسی داده نشده باشد بی‌سروصدا رد می‌شود
 * و اعلان داخل خود اپ همچنان کار می‌کند.
 */
export function useBrowserNotifications(
  notifications: StoredNotification[],
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    let alreadyPushed: string | null = null;
    try {
      alreadyPushed = window.localStorage.getItem(LAST_PUSHED_KEY);
    } catch {
      alreadyPushed = null;
    }
    if (alreadyPushed) return;

    const latest = notifications.find((n) => !n.read);
    if (!latest) return;

    pushBrowserNotification(latest);
    try {
      window.localStorage.setItem(LAST_PUSHED_KEY, new Date().toISOString());
    } catch {
      // حافظه‌ی محلی در دسترس نیست؛ فقط همین یک بار اعلان می‌رود
    }
  }, [notifications, enabled]);
}

/** درخواست اجازه‌ی نمایش نوتیفیکیشن مرورگر */
export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}