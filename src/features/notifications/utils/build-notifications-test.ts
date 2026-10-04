import { describe, expect, it } from "vitest";
import type { Reminder } from "@/features/tasks/types";
import type { ExpiringReminder } from "@/features/vehicles/types";
import {
  buildReminderNotifications,
  buildVehicleNotifications,
  mergeNotifications,
} from "./build-notifications";

/** نقطه مرجع ثابت: ۱۵ اکتبر ۲۰۲۵، ساعت ۱۰:۰۰ */
const NOW = new Date(2025, 9, 15, 10, 0, 0);

function buildReminder(overrides: Partial<Reminder> & { dueAt: string }): Reminder {
  return {
    id: "r1",
    title: "تست",
    description: null,
    snoozedUntil: null,
    priority: "normal",
    recurrence: "none",
    done: false,
    completedAt: null,
    createdAt: NOW.toISOString(),
    updatedAt: NOW.toISOString(),
    ...overrides,
  };
}

function buildExpiring(
  overrides: Partial<ExpiringReminder> & { refId: string },
): ExpiringReminder {
  return {
    kind: "insurance",
    vehicleId: "v1",
    vehicleName: "پراید",
    title: "بیمه شخص ثالث",
    detail: "تمدید بیمه",
    dueDate: "2025-10-15",
    dueKm: null,
    daysRemaining: 0,
    severity: "urgent",
    ...overrides,
  };
}

describe("buildReminderNotifications", () => {
  it("یادآور انجام‌شده را اعلان نمی‌سازد", () => {
    const result = buildReminderNotifications(
      [buildReminder({ dueAt: NOW.toISOString(), done: true })],
      NOW,
    );
    expect(result).toHaveLength(0);
  });

  it("یادآوری که موعدش رسیده اعلان می‌سازد", () => {
    const result = buildReminderNotifications(
      [buildReminder({ dueAt: NOW.toISOString(), title: "کار urgent" })],
      NOW,
    );
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("reminder");
    expect(result[0].severity).toBe("urgent");
    expect(result[0].title).toBe("کار urgent");
    expect(result[0].href).toBe("/tasks");
  });

  it("یادآورِ دیروز را overdue علامت می‌زند", () => {
    const result = buildReminderNotifications(
      [buildReminder({ dueAt: new Date(2025, 9, 14, 9, 0).toISOString() })],
      NOW,
    );
    expect(result[0].severity).toBe("overdue");
  });

  it("یادآوری که چند دقیقه پیش رسیده «فوری» است نه «گذشته»", () => {
    const result = buildReminderNotifications(
      [buildReminder({ dueAt: new Date(2025, 9, 15, 9, 57).toISOString() })],
      NOW,
    );
    expect(result[0].severity).toBe("urgent");
  });

  it("یادآوری که هنوز موعدش نرسیده اعلان نمی‌سازد", () => {
    const result = buildReminderNotifications(
      [
        buildReminder({ dueAt: new Date(2025, 9, 15, 10, 2).toISOString() }),
        buildReminder({ dueAt: new Date(2025, 9, 16, 9, 0).toISOString() }),
      ],
      NOW,
    );
    expect(result).toHaveLength(0);
  });

  it("تعویق یادآور گذشته را از ثبت اعلان بازمی‌دارد", () => {
    const reminder = buildReminder({
      dueAt: new Date(2025, 9, 15, 9, 0).toISOString(),
      snoozedUntil: new Date(2025, 9, 15, 11, 0).toISOString(),
    });
    // موعد مؤثر ۱۱:۰۰ هنوز نرسیده، پس نباید اعلانی ساخته شود
    expect(buildReminderNotifications([reminder], NOW)).toHaveLength(0);
  });

  it("شناسه یکتا و پایدار برای همان موعد می‌سازد", () => {
    const reminder = buildReminder({ dueAt: NOW.toISOString() });
    const first = buildReminderNotifications([reminder], NOW);
    const second = buildReminderNotifications([reminder], NOW);
    expect(first[0].id).toBe(second[0].id);
  });

  it("بدون توضیح، متن پیش‌فرض می‌گذارد", () => {
    const result = buildReminderNotifications(
      [buildReminder({ dueAt: NOW.toISOString() })],
      NOW,
    );
    expect(result[0].body).toBe("موعد این یادآور رسیده است.");
  });

  it("تشخیص «گذشته» بر اساس زمان مبنا است، نه ساعت واقعی سیستم", () => {
    const reminder = buildReminder({ dueAt: NOW.toISOString() });

    // موعد ساعت ۱۰:۰۰ همان روزِ مبنا است، پس هنوز «گذشته از امروز» نیست
    const sameDay = buildReminderNotifications([reminder], NOW);
    expect(sameDay[0].severity).not.toBe("overdue");

    // همان یادآور، ولی با مبنای دو روز بعد — این‌بار موعد به دیروز افتاده
    const later = buildReminderNotifications(
      [reminder],
      new Date(2025, 9, 17, 12, 0),
    );
    expect(later[0].severity).toBe("overdue");
  });
});

describe("buildVehicleNotifications", () => {
  it("سررسید امروز را اعلان می‌سازد", () => {
    const result = buildVehicleNotifications(
      [buildExpiring({ refId: "i1", dueDate: "2025-10-15" })],
      NOW,
    );
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("vehicle");
    expect(result[0].category).toBe("بیمه خودرو");
    expect(result[0].href).toBe("/vehicles");
    expect(result[0].title).toContain("پراید");
  });

  it("سررسید گذشته را overdue می‌کند", () => {
    const result = buildVehicleNotifications(
      [
        buildExpiring({
          refId: "i2",
          dueDate: "2025-10-01",
          daysRemaining: -14,
          severity: "overdue",
        }),
      ],
      NOW,
    );
    expect(result[0].severity).toBe("overdue");
  });

  it("سررسید آینده را نمی‌سازد حتی اگر soon باشد", () => {
    const result = buildVehicleNotifications(
      [
        buildExpiring({
          refId: "i6",
          dueDate: "2025-10-20",
          daysRemaining: 5,
          severity: "soon",
        }),
      ],
      NOW,
    );
    expect(result).toHaveLength(0);
  });

  it("مورد سالم یا بدون تاریخ را نمی‌سازد", () => {
    const result = buildVehicleNotifications(
      [
        buildExpiring({ refId: "i3", dueDate: null, severity: "ok" }),
        buildExpiring({ refId: "i4", severity: "ok" }),
      ],
      NOW,
    );
    expect(result).toHaveLength(0);
  });

  it("برچسب دسته را بر اساس نوع درست می‌کند", () => {
    const result = buildVehicleNotifications(
      [
        buildExpiring({ refId: "t1", kind: "toll", dueDate: "2025-10-15" }),
        buildExpiring({ refId: "s1", kind: "service", dueDate: "2025-10-15" }),
      ],
      NOW,
    );
    expect(result.map((n) => n.category)).toEqual([
      "عوارض خودرو",
      "سرویس خودرو",
    ]);
  });
});

describe("mergeNotifications", () => {
  it("تکراری‌ها را بر اساس شناسه حذف می‌کند", () => {
    const notification = {
      id: "x",
      source: "reminder" as const,
      severity: "urgent" as const,
      category: "یادآور کار",
      title: "یکی",
      body: "",
      dueAt: NOW.toISOString(),
      href: "/tasks",
    };
    const result = mergeNotifications([notification], [notification]);
    expect(result).toHaveLength(1);
  });

  it("موعد نزدیک‌تر را بالاتر می‌گذارد", () => {
    const base = {
      source: "reminder" as const,
      severity: "urgent" as const,
      category: "یادآور کار",
      body: "",
      href: "/tasks",
    };
    const result = mergeNotifications([
      { ...base, id: "late", title: "دیر", dueAt: new Date(2025, 9, 15, 18).toISOString() },
      { ...base, id: "soon", title: "زود", dueAt: new Date(2025, 9, 15, 11).toISOString() },
    ]);
    expect(result.map((n) => n.id)).toEqual(["soon", "late"]);
  });

  it("اعلان‌های خودرو و یادآور را با هم ترکیب می‌کند", () => {
    const result = mergeNotifications(
      buildReminderNotifications(
        [buildReminder({ dueAt: NOW.toISOString() })],
        NOW,
      ),
      buildVehicleNotifications(
        [buildExpiring({ refId: "i1", dueDate: "2025-10-15" })],
        NOW,
      ),
    );
    expect(result.map((n) => n.source).sort()).toEqual(["reminder", "vehicle"]);
  });
});