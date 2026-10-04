import type { ExpiringReminder } from "@/features/vehicles/types";
import type { Reminder } from "@/features/tasks/types";
import { getEffectiveDueAt } from "@/features/tasks/utils/reminder-helpers";
import { parseISODateOnly } from "@/utils";
import type { AppNotification, NotificationSeverity } from "../types";

/**
 * اعلان زمانی ثبت می‌شود که موعدش رسیده باشد.
 * برای یادآورها «رسیدن» یعنی همان لحظه‌ی دقیق ساعت، و برای سررسیدهای خودرو
 * که فقط تاریخ دارند، یعنی شروع همان روز. پس هیچ اعلانی زودتر از موعد
 * ساخته نمی‌شود و تنها زمانی که موعد رسیده باشد وارد اعلان‌سنتر می‌شود.
 */

/** نیمه‌شب همان روزِ مبنا — بر اساس پارامتر now، نه ساعت واقعی سیستم */
function startOfDay(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * شدت اعلان بر اساس موعد:
 * موعدِ قبل از امروز «گذشته از موعد» است، و موعدِ امروز یا نزدیک «فوری».
 * اعلان ساخته می‌شود که موعد رسیده باشد، پس «نزدیک» فقط برای سررسیدهای
 * خودروی امروز به کار می‌رود که شروع روزشان مبنا قرار می‌گیرد.
 */
function severityFor(reachedMs: number, now: Date): NotificationSeverity {
  return reachedMs < startOfDay(now).getTime() ? "overdue" : "urgent";
}

/**
 * یادآورهای کارها را به اعلان تبدیل می‌کند.
 * فقط یادآورهای انجام‌نشده‌ای که موعدشان رسیده (یا گذشته) اعلان می‌سازند.
 * شناسه بر پایه‌ی شناسه و زمان مؤثر ساخته می‌شود تا تعویق‌کردن، اعلان تازه
 * بسازد و اعلان قبلی دوباره ثبت نشود.
 */
export function buildReminderNotifications(
  reminders: Reminder[],
  now: Date = new Date(),
): AppNotification[] {
  const currentTime = now.getTime();
  const result: AppNotification[] = [];

  for (const reminder of reminders) {
    if (reminder.done) {
      continue;
    }
    const effective = getEffectiveDueAt(reminder);
    const time = effective.getTime();
    if (Number.isNaN(time) || time > currentTime) {
      continue;
    }

    const overdue = time < startOfDay(now).getTime();
    result.push({
      id: `reminder:${reminder.id}:${effective.toISOString()}`,
      source: "reminder",
      severity: severityFor(time, now),
      category: "یادآور کار",
      title: reminder.title,
      body: reminder.description?.trim()
        ? reminder.description
        : overdue
          ? "موعد این یادآور گذشته است."
          : "موعد این یادآور رسیده است.",
      dueAt: effective.toISOString(),
      href: "/tasks",
    });
  }

  return result;
}

const VEHICLE_CATEGORY: Record<ExpiringReminder["kind"], string> = {
  insurance: "بیمه خودرو",
  toll: "عوارض خودرو",
  service: "سرویس خودرو",
};

/**
 * سررسیدهای خودرو را به اعلان تبدیل می‌کند.
 * این داده تاریخ (روز) است نه ساعت، پس «رسیدن» به معنی شروع همان روز است.
 * موارد سالم (ok) که هنوز موعدشان نرسیده اعلان نمی‌سازند.
 */
export function buildVehicleNotifications(
  expiring: ExpiringReminder[],
  now: Date = new Date(),
): AppNotification[] {
  const currentTime = now.getTime();
  const result: AppNotification[] = [];

  for (const reminder of expiring) {
    if (!reminder.dueDate || reminder.severity === "ok") {
      continue;
    }
    const day = parseISODateOnly(reminder.dueDate);
    if (!day) {
      continue;
    }
    const dueStart = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
    );
    if (dueStart.getTime() > currentTime) {
      continue;
    }

    result.push({
      id: `vehicle:${reminder.kind}:${reminder.refId}:${reminder.dueDate}`,
      source: "vehicle",
      severity: severityFor(dueStart.getTime(), now),
      category: VEHICLE_CATEGORY[reminder.kind],
      title: `${reminder.title} — ${reminder.vehicleName}`,
      body: reminder.detail,
      dueAt: dueStart.toISOString(),
      href: "/vehicles",
    });
  }

  return result;
}

/** ترکیب دو منبع و مرتب‌سازی: فوری‌ترین و تازه‌ترین اعلان‌ها بالا */
export function mergeNotifications(
  ...groups: AppNotification[][]
): AppNotification[] {
  const unique = new Map<string, AppNotification>();
  for (const group of groups) {
    for (const notification of group) {
      unique.set(notification.id, notification);
    }
  }
  return [...unique.values()].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
  );
}