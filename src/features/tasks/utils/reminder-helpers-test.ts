import { describe, expect, it } from "vitest";
import type { Checklist, Reminder } from "../types";
import {
  countRemindersByFilter,
  filterChecklists,
  filterReminders,
  getChecklistProgress,
  getEffectiveDueAt,
  getReminderPeriod,
  paginateReminders,
  REMINDERS_PAGE_SIZE,
  sortReminders,
} from "./reminder-helpers";

/** نقطه مرجع ثابت: چهارشنبه ۱۵ اکتبر ۲۰۲۵، ساعت ۱۰:۰۰ */
const NOW = new Date(2025, 9, 15, 10, 0, 0);

function buildReminder(
  overrides: Partial<Reminder> & { dueAt: string },
): Reminder {
  return {
    id: "reminder-1",
    title: "یادآور آزمایشی",
    description: null,
    snoozedUntil: null,
    priority: "normal",
    recurrence: "none",
    done: false,
    completedAt: null,
    createdAt: "2025-10-01T00:00:00.000Z",
    updatedAt: "2025-10-01T00:00:00.000Z",
    ...overrides,
  };
}

function isoAt(daysFromNow: number, hour: number): string {
  const date = new Date(2025, 9, 15 + daysFromNow, hour, 0, 0);
  const pad = (value: number): string => `${value}`.padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(hour)}:00:00`;
}

describe("getEffectiveDueAt", () => {
  it("موعد اصلی را بدون Snooze برمی‌گرداند", () => {
    const reminder = buildReminder({ dueAt: isoAt(1, 9) });
    expect(getEffectiveDueAt(reminder).getTime()).toBe(
      new Date(reminder.dueAt).getTime(),
    );
  });

  it("با Snooze فعال، موعد مؤثر جابه‌جا می‌شود", () => {
    const reminder = buildReminder({
      dueAt: isoAt(1, 9),
      snoozedUntil: isoAt(3, 12),
    });
    expect(getEffectiveDueAt(reminder).getTime()).toBe(
      new Date(isoAt(3, 12)).getTime(),
    );
  });
});

describe("getReminderPeriod", () => {
  it("موعد گذشته را در «امروز» دسته‌بندی می‌کند", () => {
    const reminder = buildReminder({ dueAt: isoAt(-2, 8) });
    expect(getReminderPeriod(reminder, NOW)).toBe("today");
  });

  it("موعد امروز را در «امروز» دسته‌بندی می‌کند", () => {
    const reminder = buildReminder({ dueAt: isoAt(0, 18) });
    expect(getReminderPeriod(reminder, NOW)).toBe("today");
  });

  it("فردا را در «هفته آینده» دسته‌بندی می‌کند", () => {
    const reminder = buildReminder({ dueAt: isoAt(1, 9) });
    expect(getReminderPeriod(reminder, NOW)).toBe("week");
  });

  it("پایان روز هفتم را در «هفته آینده» دسته‌بندی می‌کند", () => {
    const reminder = buildReminder({ dueAt: isoAt(7, 23) });
    expect(getReminderPeriod(reminder, NOW)).toBe("week");
  });

  it("روز هشتم را در «ماه آینده» دسته‌بندی می‌کند", () => {
    const reminder = buildReminder({ dueAt: isoAt(8, 9) });
    expect(getReminderPeriod(reminder, NOW)).toBe("month");
  });

  it("روز سی‌ویکم را در «سال آینده» دسته‌بندی می‌کند", () => {
    const reminder = buildReminder({ dueAt: isoAt(31, 9) });
    expect(getReminderPeriod(reminder, NOW)).toBe("year");
  });

  it("موعد بعد از یک سال را «دورتر» دسته‌بندی می‌کند", () => {
    const reminder = buildReminder({ dueAt: isoAt(366, 9) });
    expect(getReminderPeriod(reminder, NOW)).toBe("later");
  });
});

describe("filterReminders", () => {
  const reminders = [
    buildReminder({ id: "past", dueAt: isoAt(-1, 9) }),
    buildReminder({ id: "today", dueAt: isoAt(0, 18) }),
    buildReminder({ id: "week", dueAt: isoAt(3, 9) }),
    buildReminder({ id: "month", dueAt: isoAt(12, 9) }),
    buildReminder({ id: "year", dueAt: isoAt(60, 9) }),
    buildReminder({ id: "later", dueAt: isoAt(400, 9) }),
    buildReminder({ id: "done-week", dueAt: isoAt(3, 9), done: true }),
  ];

  it("فیلتر «همه» همه یادآورها شامل انجام‌شده‌ها را برمی‌گرداند", () => {
    const filtered = filterReminders(reminders, "all", NOW);
    expect(filtered).toHaveLength(7);
  });

  it("فیلترهای زمانی فقط یادآورهای انجام‌نشده همان بازه را برمی‌گردانند", () => {
    const week = filterReminders(reminders, "week", NOW);
    expect(week.map((reminder) => reminder.id)).toEqual(["week"]);
  });

  it("یادآورهای گذشته در فیلتر «امروز» ظاهر می‌شوند", () => {
    const today = filterReminders(reminders, "today", NOW);
    expect(today.map((reminder) => reminder.id)).toEqual(["past", "today"]);
  });
});

describe("countRemindersByFilter", () => {
  it("انجام‌شده‌ها را از شمارش بازه‌ها حذف می‌کند", () => {
    const counts = countRemindersByFilter(
      [
        buildReminder({ id: "a", dueAt: isoAt(0, 9) }),
        buildReminder({ id: "b", dueAt: isoAt(2, 9), done: true }),
        buildReminder({ id: "c", dueAt: isoAt(40, 9) }),
      ],
      NOW,
    );
    expect(counts.all).toBe(3);
    expect(counts.today).toBe(1);
    expect(counts.week).toBe(0);
    expect(counts.year).toBe(1);
  });
});

describe("sortReminders", () => {
  it("انجام‌نشده‌ها را بر اساس موعد مؤثر و انجام‌شده‌ها را در انتها مرتب می‌کند", () => {
    const sorted = sortReminders([
      buildReminder({ id: "done", dueAt: isoAt(-1, 9), done: true }),
      buildReminder({ id: "week", dueAt: isoAt(3, 9) }),
      buildReminder({ id: "today", dueAt: isoAt(0, 9) }),
    ]);
    expect(sorted.map((reminder) => reminder.id)).toEqual([
      "today",
      "week",
      "done",
    ]);
  });
});

describe("paginateReminders", () => {
  const reminders = Array.from({ length: 13 }, (_, index) =>
    buildReminder({ id: `reminder-${index}`, dueAt: isoAt(index, 9) }),
  );

  it("صفحه اول حداکثر ۱۰ آیتم برمی‌گرداند", () => {
    expect(REMINDERS_PAGE_SIZE).toBe(10);
    expect(paginateReminders(reminders, REMINDERS_PAGE_SIZE)).toHaveLength(10);
  });

  it("Show More آیتم‌های باقی‌مانده را اضافه می‌کند", () => {
    expect(
      paginateReminders(reminders, REMINDERS_PAGE_SIZE * 2),
    ).toHaveLength(13);
  });
});

describe("getChecklistProgress", () => {
  const checklist: Checklist = {
    id: "pack-1",
    title: "سفر",
    subtitle: null,
    icon: "checklist",
    active: true,
    items: [
      { id: "i1", packId: "pack-1", text: "بلیط", completed: true },
      { id: "i2", packId: "pack-1", text: "چمدان", completed: true },
      { id: "i3", packId: "pack-1", text: "پاسپورت", completed: false },
    ],
  };

  it("درصد پیشرفت را به‌درستی محاسبه می‌کند", () => {
    expect(getChecklistProgress(checklist)).toEqual({
      completedCount: 2,
      totalCount: 3,
      percent: 67,
    });
  });

  it("چک‌لیست خالی درصد صفر دارد", () => {
    const empty: Checklist = { ...checklist, items: [] };
    expect(getChecklistProgress(empty).percent).toBe(0);
  });
});

describe("filterChecklists", () => {
  const checklists: Checklist[] = [
    {
      id: "pack-1",
      title: "کمپینگ",
      subtitle: null,
      icon: "checklist",
      active: true,
      items: [{ id: "i1", packId: "pack-1", text: "چادر", completed: false }],
    },
    {
      id: "pack-2",
      title: "خرید هفتگی",
      subtitle: null,
      icon: "checklist",
      active: false,
      items: [{ id: "i2", packId: "pack-2", text: "میوه", completed: false }],
    },
  ];

  it("بر اساس عنوان و متن اقلام جست‌وجو می‌کند", () => {
    expect(filterChecklists(checklists, "میوه").map((c) => c.id)).toEqual([
      "pack-2",
    ]);
    expect(filterChecklists(checklists, "کمپینگ").map((c) => c.id)).toEqual([
      "pack-1",
    ]);
    expect(filterChecklists(checklists, "")).toHaveLength(2);
  });
});
