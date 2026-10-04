"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReminders } from "@/features/tasks/service";
import { getExpiringReminders } from "@/features/vehicles/service";
import type { ExpiringReminder } from "@/features/vehicles/types";
import { toast } from "@/components/common/toast";
import {
  buildReminderNotifications,
  buildVehicleNotifications,
  mergeNotifications,
} from "../utils/build-notifications";
import {
  countUnread,
  markAllRead as markAllReadPure,
  markRead as markReadPure,
  reconcileNotifications,
} from "../utils/notification-store";
import type { StoredNotification } from "../types";

const STORAGE_KEY = "lifehub_notifications";
const LAST_SEEN_KEY = "lifehub_notifications_last_seen";
/** هر ۳۰ ثانیه بررسی می‌کنیم که موعد تازه‌ای رسیده است یا نه */
const CHECK_INTERVAL_MS = 30_000;
/**
 * بازه‌ی سررسیدهای خودرو. فقط آینده را محدود می‌کند و موارد گذشته را نگه
 * می‌دارد، پس با بازه‌ی بزرگ‌تر، عقب‌افتاده‌های قدیمی هم اعلان می‌شوند.
 */
const EXPIRING_WINDOW_DAYS = 365;
/**
 * اعلان باید با داده‌ی زنده هماهنگ باشد، پس داده هیچ‌وقت stale نمی‌شود.
 *
 * این کوئری‌ها عمداً کلید جداگانه دارند و کلید مشترک کوئری صفحه را دوباره
 * استفاده نمی‌کنند: در React Query کوئری‌های هم‌کلید تنظیمات را از آخرین
 * observer می‌گیرند، پس با اشتراک کلید، staleTime صفحه می‌توانست داده‌ی
 * اعلان را کهنه نگه دارد.
 */
const LIVE_QUERY_OPTIONS = {
  staleTime: 0,
  refetchInterval: CHECK_INTERVAL_MS,
} as const;

const notificationQueryKeys = {
  reminders: ["notifications-source", "reminders"] as const,
  expiring: (days: number) => ["notifications-source", "expiring", days] as const,
};

function readStored(): StoredNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredNotification[]) : [];
  } catch {
    return [];
  }
}

export function useNotifications() {
  const reminders = useQuery({
    queryKey: notificationQueryKeys.reminders,
    queryFn: getReminders,
    ...LIVE_QUERY_OPTIONS,
  });
  const expiring = useQuery({
    queryKey: notificationQueryKeys.expiring(EXPIRING_WINDOW_DAYS),
    queryFn: () => getExpiringReminders(EXPIRING_WINDOW_DAYS),
    ...LIVE_QUERY_OPTIONS,
  });

  const [stored, setStored] = useState<StoredNotification[]>([]);
  const [now, setNow] = useState(() => new Date());
  /** اعلان‌هایی که در این نشست و برای اولین بار ثبت شدند — فقط یک‌بار نشان داده می‌شوند */
  const shownIds = useRef<Set<string>>(new Set());
  const hydrated = useRef(false);

  // فقط در سمت کلاینت مقدار اولیه می‌خوانیم تا از ناهماهنگی SSR جلوگیری شود
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    setStored(readStored());
    const lastSeen = window.localStorage.getItem(LAST_SEEN_KEY);
    shownIds.current = new Set(
      readStored()
        .filter((n) => !lastSeen || n.firedAt <= lastSeen)
        .map((n) => n.id),
    );
  }, []);

  // تایمر تند شدن زمان تا موعدهای نزدیک دقیق‌تر شوند و اعلان‌ها به‌موقع ثبت شوند
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), CHECK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  const candidates = useMemo(
    () =>
      mergeNotifications(
        buildReminderNotifications(reminders.data ?? [], now),
        buildVehicleNotifications(expiring.data ?? [], now),
      ),
    [reminders.data, expiring.data, now],
  );

  /** وضعیت سریال برای تشخیص تغییر داده در اثر بعدی */
  const candidatesKey = useMemo(
    () => candidates.map((n) => n.id).join("|"),
    [candidates],
  );

  // داده‌ها که آماده شدند، اعلان‌های تازه ثبت می‌شوند و وضعیت قبلی همگام می‌شود
  useEffect(() => {
    if (reminders.isPending || expiring.isPending) return;

    setStored((prev) => {
      // اعلان‌هایی که موعدشان دیگر نیست (انجام‌شده یا تعویق‌شده) کنار می‌روند
      const result = reconcileNotifications(prev, candidates, now);

      if (result.stored === prev) {
        return prev;
      }

      // فقط اعلان‌هایی که در این نشست تازه هستند یک‌بار به کاربر نشان داده می‌شوند
      const fresh = result.added.filter((n) => !shownIds.current.has(n.id));
      for (const notification of fresh) {
        shownIds.current.add(notification.id);
        toast.info(notification.title);
      }

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(result.stored),
      );
      return result.stored;
    });
  }, [candidatesKey, candidates, reminders.isPending, expiring.isPending, now]);

  const markRead = useCallback((id: string) => {
    setStored((prev) => {
      const next = markReadPure(prev, id);
      if (next === prev) return prev;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setStored((prev) => {
      const next = markAllReadPure(prev);
      if (next === prev) return prev;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setStored([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  /** وقتی مرکز اعلان‌ها باز می‌شود، زمان آخرین بازدید ثبت می‌شود */
  const registerOpened = useCallback(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
  }, []);

  const unreadCount = useMemo(() => countUnread(stored), [stored]);

  return {
    notifications: stored,
    unreadCount,
    markRead,
    markAllRead,
    clearAll,
    registerOpened,
    isLoading: reminders.isPending || expiring.isPending,
  };
}