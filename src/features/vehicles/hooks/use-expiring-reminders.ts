import { useQuery } from "@tanstack/react-query";
import { getExpiringReminders } from "../service";
import { vehicleKeys } from "./vehicle-query-keys";

export function useExpiringReminders(days = 30, vehicleId?: string) {
  return useQuery({
    queryKey: vehicleKeys.expiring(days, vehicleId),
    queryFn: () => getExpiringReminders(days, vehicleId),
  });
}
