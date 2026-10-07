import { useQuery } from "@tanstack/react-query";
import { getTimeline } from "../service/timeline-service";

export const timelineKeys = {
  all: ["timeline"] as const,
};

export function useTimeline() {
  return useQuery({
    queryKey: timelineKeys.all,
    queryFn: getTimeline,
  });
}
