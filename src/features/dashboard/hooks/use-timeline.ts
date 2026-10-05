import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { createTimelineEvent, getTimeline } from "../service/timeline-service";
import type { CreateTimelineEventInput } from "../service/timeline-service";

export const timelineKeys = {
  all: ["timeline"] as const,
};

export function useTimeline() {
  return useQuery({
    queryKey: timelineKeys.all,
    queryFn: getTimeline,
  });
}

export function useCreateTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTimelineEventInput) => createTimelineEvent(input),
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.all });
      toast.success(`«${event.title}» در تایم‌لاین ثبت شد`);
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "ثبت رویداد ناموفق بود"));
    },
  });
}
