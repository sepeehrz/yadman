import { describe, expect, it } from "vitest";
import type { AppNotification, StoredNotification } from "../types";
import {
  appendNewNotifications,
  clearAll as clearAllPure,
  countUnread,
  markAllRead,
  markRead,
  MAX_STORED_NOTIFICATIONS,
  reconcileNotifications,
  selectUnseenSince,
  syncWithLiveDeadlines,
} from "./notification-store";

const NOW = new Date(2025, 9, 15, 10, 0, 0);

function buildNotification(id: string, title = id): AppNotification {
  return {
    id,
    source: "reminder",
    severity: "urgent",
    category: "یادآور کار",
    title,
    body: "",
    dueAt: NOW.toISOString(),
    href: "/tasks",
  };
}

function stored(id: string, read = false): StoredNotification {
  return { ...buildNotification(id), read, firedAt: NOW.toISOString() };
}

describe("appendNewNotifications", () => {
  it("اعلان تازه را نخوانده اضافه می‌کند", () => {
    const result = appendNewNotifications([], [buildNotification("a")], NOW);
    expect(result.added).toHaveLength(1);
    expect(result.stored[0].read).toBe(false);
    expect(result.stored[0].firedAt).toBe(NOW.toISOString());
  });

  it("اعلان با شناسه‌ی تکراری را دوباره ثبت نمی‌کند", () => {
    const first = appendNewNotifications([], [buildNotification("a")], NOW);
    const second = appendNewNotifications(
      first.stored,
      [buildNotification("a")],
      NOW,
    );
    expect(second.added).toHaveLength(0);
    expect(second.stored).toHaveLength(1);
  });

  it("چند اعلان تکراری در یک دسته را یک‌بار ثبت می‌کند", () => {
    const result = appendNewNotifications(
      [],
      [buildNotification("a"), buildNotification("a")],
      NOW,
    );
    expect(result.added).toHaveLength(1);
  });

  it("تازه‌ترین ثبت‌شده‌ها را بالا نگه می‌دارد", () => {
    const base = appendNewNotifications([], [buildNotification("old")], NOW);
    const later = appendNewNotifications(
      base.stored,
      [buildNotification("new")],
      new Date(2025, 9, 15, 12, 0),
    );
    expect(later.stored[0].id).toBe("new");
  });

  it("فهرست را زیر سقف نگه می‌دارد", () => {
    let current: StoredNotification[] = [];
    for (let i = 0; i < MAX_STORED_NOTIFICATIONS + 10; i += 1) {
      current = appendNewNotifications(
        current,
        [buildNotification(`id-${i}`)],
        new Date(2025, 9, 15, 10, i),
      ).stored;
    }
    expect(current).toHaveLength(MAX_STORED_NOTIFICATIONS);
  });

  it("وقتی چیزی جدیدی نیست، همان آرایه را برمی‌گرداند", () => {
    const base = appendNewNotifications([], [buildNotification("a")], NOW);
    const result = appendNewNotifications(
      base.stored,
      [buildNotification("a")],
      NOW,
    );
    expect(result.stored).toBe(base.stored);
  });
});

describe("خواندن اعلان‌ها", () => {
  it("یک اعلان را خوانده می‌کند", () => {
    const next = markRead([stored("a"), stored("b")], "a");
    expect(next[0].read).toBe(true);
    expect(next[1].read).toBe(false);
  });

  it("همه را خوانده می‌کند", () => {
    const next = markAllRead([stored("a"), stored("b", true)]);
    expect(next.every((n) => n.read)).toBe(true);
  });

  it("اگر همه خوانده باشند همان آرایه را برمی‌گرداند", () => {
    const current = markAllRead([stored("a")]);
    expect(markAllRead(current)).toBe(current);
  });

  it("تعداد خوانده‌نشده‌ها را می‌شمارد", () => {
    expect(countUnread([stored("a"), stored("b", true), stored("c")])).toBe(2);
  });
});

describe("selectUnseenSince", () => {
  it("بدون زمان مرجع چیزی برنمی‌گرداند", () => {
    expect(selectUnseenSince([stored("a")], null)).toHaveLength(0);
  });

  it("فقط اعلان‌های بعد از زمان مرجع را برمی‌گرداند", () => {
    const old: StoredNotification = {
      ...stored("old"),
      firedAt: new Date(2025, 9, 15, 9, 0).toISOString(),
    };
    const fresh: StoredNotification = {
      ...stored("fresh"),
      firedAt: new Date(2025, 9, 15, 11, 0).toISOString(),
    };
    const result = selectUnseenSince(
      [old, fresh],
      new Date(2025, 9, 15, 10, 0).toISOString(),
    );
    expect(result.map((n) => n.id)).toEqual(["fresh"]);
  });
});

describe("syncWithLiveDeadlines", () => {
  it("اعلانی که موعدش هنوز نرسیده نگه می‌دارد", () => {
    const current = [stored("a")];
    expect(syncWithLiveDeadlines(current, [buildNotification("a")])).toHaveLength(1);
  });

  it("اعلان یادآورِ انجام‌شده یا تعویق‌شده را از اعلان‌سنتر برمی‌دارد", () => {
    const current = [stored("a"), stored("b")];
    // فقط «a» هنوز در فهرست موعدهای زنده هست
    const next = syncWithLiveDeadlines(current, [buildNotification("a")]);
    expect(next.map((n) => n.id)).toEqual(["a"]);
  });

  it("اگر چیزی تغییر نکرد، همان آرایه را برمی‌گرداند", () => {
    const current = [stored("a")];
    expect(syncWithLiveDeadlines(current, [buildNotification("a")])).toBe(current);
  });

  it("اگر هیچ موعد زنده‌ای نمانده باشد، فهرست خالی می‌شود", () => {
    expect(syncWithLiveDeadlines([stored("a")], [])).toHaveLength(0);
  });
});

describe("clearAll", () => {
  it("فهرست را خالی می‌کند", () => {
    expect(clearAllPure([stored("a"), stored("b")])).toHaveLength(0);
  });
});
describe("reconcileNotifications", () => {
  it("اعلان یادآوری را که انجام شده از اعلان‌سنتر برمی‌دارد", () => {
    // سناریویی که قبلاً خراب بود: هیچ اعلان تازه‌ای هم اضافه نمی‌شود،
    // ولی نتیجه باید با حذف رکوردِ ازکارافتاده تغییر کند.
    const current = [stored("a")];
    const result = reconcileNotifications(current, [], NOW);

    expect(result.added).toHaveLength(0);
    expect(result.stored).toHaveLength(0);
  });

  it("نتیجه باید با ورودی سنجیده شود نه با خروجی همگام‌سازی", () => {
    const current = [stored("a")];
    const result = reconcileNotifications(current, [], NOW);
    expect(result.stored).not.toBe(current);
  });

  it("اگر نه چیزی حذف و نه چیزی اضافه شد، همان آرایه را برمی‌گرداند", () => {
    const current = [stored("a")];
    const result = reconcileNotifications(current, [buildNotification("a")], NOW);
    expect(result.stored).toBe(current);
  });

  it("موعد تازه را اضافه می‌کند و رکوردی که دیگر زنده نیست کنار می‌رود", () => {
    const current = [stored("a")];
    // فقط «b» موعد زنده است، پس «a» (که موعدش دیگر نیست) حذف می‌شود
    const result = reconcileNotifications(current, [buildNotification("b")], NOW);

    expect(result.added.map((n) => n.id)).toEqual(["b"]);
    expect(result.stored.map((n) => n.id)).toEqual(["b"]);
  });

  it("تعویق یادآور، رکورد قبلی را برمی‌دارد و اعلان تازه نمی‌سازد", () => {
    const current = [stored("a")];
    // موعد تعویق‌شده هنوز نرسیده، پس در فهرست زنده نیست
    const result = reconcileNotifications(current, [], NOW);

    expect(result.stored).toHaveLength(0);
    expect(result.added).toHaveLength(0);
  });

  it("حذف و اضافه همزمان را با هم اعمال می‌کند", () => {
    const current = [stored("a"), stored("b")];
    const result = reconcileNotifications(
      current,
      [buildNotification("b"), buildNotification("c")],
      NOW,
    );

    expect(result.added.map((n) => n.id)).toEqual(["c"]);
    expect(result.stored.map((n) => n.id).sort()).toEqual(["b", "c"]);
  });
});
