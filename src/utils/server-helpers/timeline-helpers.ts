import type { TimelineEvent } from "@/types";
import type { TimelineEventRow } from "@/types/server-types";

export function mapTimelineEvent(row: TimelineEventRow): TimelineEvent {
  return {
    id: row.id,
    title: row.title,
    timeLabel: row.timeLabel,
    dateBadge: row.dateBadge,
    category: row.category as TimelineEvent["category"],
    categoryLabel: row.categoryLabel,
    subtitle: row.subtitle,
    icon: row.icon,
  };
}
