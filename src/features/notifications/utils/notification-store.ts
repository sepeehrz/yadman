import type { AppNotification, StoredNotification } from "../types";

/** سقف اعلان‌های نگه‌داشته‌شته تا حافظه‌ی محلی بی‌رویه رشد نکند */
export const MAX_STORED_NOTIFICATIONS = 50;

/**
 * اعلان‌هایی که هنوز ثبت نشده‌اند را به انتهای فهرست موجود اضافه می‌کند.
 * اعلان‌های تکراری با شناسه‌ی پایدار نادیده گرفته می‌شوند، پس هر بار mount
 * شدن اپ باعث ثبت دوباره‌ی اعلان‌های قبلی نمی‌شود.
 */
export function appendNewNotifications(
  stored: StoredNotification[],
  incoming: AppNotification[],
  now: Date = new Date(),
): { stored: StoredNotification[]; added: StoredNotification[] } {
  const known = new Set(stored.map((n) => n.id));
  const added: StoredNotification[] = [];

  for (const notification of incoming) {
    if (known.has(notification.id)) {
      continue;
    }
    known.add(notification.id);
    added.push({ ...notification, read: false, firedAt: now.toISOString() });
  }

  if (added.length === 0) {
    return { stored, added };
  }

  // تازه‌ترین ثبت‌شده‌ها بالا می‌مانند و فهرست سقف‌دار می‌شود
  const merged = [...added, ...stored].sort(
    (a, b) => new Date(b.firedAt).getTime() - new Date(a.firedAt).getTime(),
  );

  return { stored: merged.slice(0, MAX_STORED_NOTIFICATIONS), added };
}

/**
 * وضعیت اعلان‌های ثبت‌شده را با موعدهای فعلی همگام می‌کند.
 *
 * اعلان‌هایی که دیگر موعدشان نیست — یادآور انجام‌شده یا به تعویق افتاده —
 * از اعلان‌سنتر برداشته می‌شوند، ولی از تاریخچه پاک نمی‌شوند: همان اعلان
 * با همان شناسه دوباره ساخته نمی‌شود، پس اگر کاربر به همان موعد برگردد
 * اعلان تکراری نمایش داده نمی‌شود.
 */
export function syncWithLiveDeadlines(
  stored: StoredNotification[],
  live: AppNotification[],
): StoredNotification[] {
  const stillLive = new Set(live.map((n) => n.id));
  const next = stored.filter((n) => stillLive.has(n.id));
  return next.length === stored.length ? stored : next;
}

/**
 * وضعیت ثبت‌شده را با موعدهای زنده آشتی می‌دهد: رکوردهای ازکارافتاده حذف
 * و اعلان‌های تازه اضافه می‌شوند.
 *
 * این همان ترکیبی است که هوک اعلان اجرا می‌کند. خالص نگه‌داشته شده تا بشود
 * سناریوی «یادآور انجام شد و باید از اعلان‌سنتر برود» را مستقیم تست کرد —
 * همان سناریویی که وقتی ترکیب داخل خود هوک بود پوشش داده نمی‌شد.
 */
export function reconcileNotifications(
  stored: StoredNotification[],
  live: AppNotification[],
  now: Date = new Date(),
): { stored: StoredNotification[]; added: StoredNotification[] } {
  const synced = syncWithLiveDeadlines(stored, live);
  const result = appendNewNotifications(synced, live, now);

  // نتیجه باید با وضعیت قبلی سنجیده شود، نه با synced: همگام‌سازی ممکن
  // است رکوردی را حذف کند بی‌آنکه اعلان تازه‌ای اضافه شود، و در آن حالت
  // result.stored برابر synced است ولی با ورودی فرق دارد.
  if (result.added.length === 0 && result.stored === stored) {
    return { stored, added: [] };
  }

  return result;
}

/** اعلان‌های نخوانده را خوانده‌شده علامت می‌زند */
export function markAllRead(
  stored: StoredNotification[],
): StoredNotification[] {
  let changed = false;
  const next = stored.map((notification) => {
    if (notification.read) {
      return notification;
    }
    changed = true;
    return { ...notification, read: true };
  });
  return changed ? next : stored;
}

export function markRead(
  stored: StoredNotification[],
  id: string,
): StoredNotification[] {
  return stored.map((notification) =>
    notification.id === id && !notification.read
      ? { ...notification, read: true }
      : notification,
  );
}

/** شمارنده‌ی نقطه‌ی قرمز روی آیکون اعلان در هدر */
export function countUnread(
  stored: StoredNotification[],
): number {
  return stored.filter((notification) => !notification.read).length;
}

/** حذف همه‌ی اعلان‌های ثبت‌شده */
export function clearAll(_stored: StoredNotification[]): StoredNotification[] {
  return [];
}

/**
 * اعلان‌هایی که از آخرین بازدید کاربر جدید بوده‌اند.
 * برای نمایش نوتیفیکیشن سیستم‌عاملی استفاده می‌شود تا برای اعلان‌های تکراری
 * هر بار پیام تکراری نشود.
 */
export function selectUnseenSince(
  stored: StoredNotification[],
  since: string | null,
): StoredNotification[] {
  if (!since) {
    return [];
  }
  const threshold = new Date(since).getTime();
  if (Number.isNaN(threshold)) {
    return [];
  }
  return stored.filter((n) => new Date(n.firedAt).getTime() > threshold);
}