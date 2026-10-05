import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { createTracker, deleteTracker, getTrackers, updateTracker } from "../service";
import type { CreateTrackerRequest, UpdateTrackerRequest } from "../types/tracker-types";
import { vehicleKeys } from "./vehicle-query-keys";

export function useTrackers() {
  return useQuery({
    queryKey: vehicleKeys.trackers(),
    queryFn: getTrackers,
  });
}

export function useCreateTracker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTrackerRequest) => createTracker(input),
    onSuccess: (tracker) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.trackers() });
      toast.success(`ردیاب «${tracker.title}» ساخته شد`);
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "ساخت ردیاب ناموفق بود"));
    },
  });
}

export function useUpdateTracker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      trackerId,
      input,
    }: {
      trackerId: string;
      input: UpdateTrackerRequest;
    }) => updateTracker(trackerId, input),
    onSuccess: (tracker) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.trackers() });
      toast.success(`ردیاب «${tracker.title}» به‌روزرسانی شد`);
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "به‌روزرسانی ردیاب ناموفق بود"));
    },
  });
}

export function useDeleteTracker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trackerId: string) => deleteTracker(trackerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.trackers() });
      toast.success("ردیاب حذف شد");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "حذف ردیاب ناموفق بود"));
    },
  });
}
