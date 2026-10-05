import { faNum } from "@/lib/format";

export interface TrackerProgressInput {
  currentKm?: number | null;
  targetKm?: number | null;
  intervalKm?: number | null;
}

export interface TrackerProgress {
  category: "urgent" | "due-soon" | "healthy";
  badgeText: string;
  badgeType: "error" | "primary" | "tertiary";
  percentage: number;
}

/**
 * قواعد نمایش پیشرفت ردیاب سرویس — تنها منبع این منطق (سرور و کلاینت).
 * ۵۰۰ کیلومتر آخر به «due-soon» و کیلومتر منفی به «urgent» می‌رود.
 */
export function computeTrackerProgress(
  input: TrackerProgressInput,
): TrackerProgress {
  const { currentKm, targetKm, intervalKm } = input;

  if (currentKm == null || targetKm == null) {
    return { category: "healthy", badgeText: "", badgeType: "tertiary", percentage: 0 };
  }

  const remainingKm = targetKm - currentKm;
  const category =
    remainingKm <= 0 ? "urgent" : remainingKm <= 1000 ? "due-soon" : "healthy";
  const badgeText =
    remainingKm <= 0
      ? `${faNum(Math.abs(remainingKm))} کیلومتر عقب‌افتادگی`
      : `${faNum(remainingKm)} کیلومتر تا موعد`;
  const badgeType =
    remainingKm <= 0 ? "error" : remainingKm <= 1000 ? "primary" : "tertiary";

  // درصد چرخه بر اساس فاصله تا آستانه بعدی در دوره جاری
  const percentage =
    intervalKm && intervalKm > 0
      ? Math.max(0, Math.min(100, Math.round(((intervalKm - remainingKm) / intervalKm) * 100)))
      : Math.max(0, Math.min(100, Math.round((remainingKm / Math.max(targetKm, 1)) * 100)));

  return { category, badgeText, badgeType, percentage };
}

/** آیکون پیش‌فرض بر اساس نام سرویس — مطابق طبقه‌بندی سرویس‌های دوره‌ای */
export function trackerIconForService(title: string): string {
  if (title.includes("روغن")) return "oil_barrel";
  if (title.includes("تایر")) return "tire_repair";
  if (title.includes("بیمه")) return "security";
  return "disc_full";
}
