import type { timelineEvents } from "@/database/schema/timeline";

export type TimelineEventRow = typeof timelineEvents.$inferSelect;
