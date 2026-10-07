import { apiClient } from "@/lib/api";
import type { TimelineEvent } from "@/types";

export async function getTimeline(): Promise<TimelineEvent[]> {
  const { data } = await apiClient.get<TimelineEvent[]>("/timeline");
  return data;
}
