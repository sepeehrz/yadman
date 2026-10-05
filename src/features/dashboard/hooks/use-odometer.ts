import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { vehicleKeys } from "@/features/vehicles/hooks/vehicle-query-keys";
import { fetchOdometer, updateOdometer } from "../service/user-preferences-service";

export const odometerKeys = {
  all: ["user-preferences"] as const,
};

export function useOdometer() {
  return useQuery({
    queryKey: odometerKeys.all,
    queryFn: fetchOdometer,
  });
}

export function useUpdateOdometer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (odometerKm: number) => updateOdometer(odometerKm),
    onSuccess: (preferences) => {
      queryClient.setQueryData(odometerKeys.all, preferences);
      // آستانه‌های ردیاب‌ها در سرور بازمحاسبه شده‌اند
      queryClient.invalidateQueries({ queryKey: vehicleKeys.trackers() });
      toast.success(`کیلومتر به ${preferences.odometerKm.toLocaleString("fa-IR")} به‌روزرسانی شد`);
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "به‌روزرسانی کیلومتر ناموفق بود"));
    },
  });
}
