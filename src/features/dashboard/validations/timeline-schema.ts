import { z } from "zod";

/** اعتبارسنجی رویداد تایم‌لاین — ورودی POST /api/timeline */
export const createTimelineEventSchema = z.object({
  title: z.string().trim().min(2, "عنوان رویداد الزامی است").max(140),
  timeLabel: z.string().trim().min(1, "برچسب زمان الزامی است").max(60),
  dateBadge: z.string().trim().min(1, "برچسب تاریخ الزامی است").max(60),
  category: z.enum(["health", "auto", "finance", "travel"]),
  categoryLabel: z.string().trim().min(1).max(60),
  subtitle: z.string().trim().max(200).optional().default(""),
  icon: z.string().trim().max(60).optional().default("event"),
});
