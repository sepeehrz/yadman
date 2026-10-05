import { apiClient } from "@/lib/api";
import type { TimelineEvent } from "@/lib/types";

export interface CreateTimelineEventInput {
  title: string;
  timeLabel: string;
  dateBadge: string;
  category: "health" | "auto" | "finance" | "travel";
  categoryLabel: string;
  subtitle?: string;
  icon?: string;
}

export async function getTimeline(): Promise<TimelineEvent[]> {
  const { data } = await apiClient.get<TimelineEvent[]>("/timeline");
  return data;
}

export async function createTimelineEvent(
  input: CreateTimelineEventInput,
): Promise<TimelineEvent> {
  const { data } = await apiClient.post<TimelineEvent>("/timeline", input);
  return data;
}
