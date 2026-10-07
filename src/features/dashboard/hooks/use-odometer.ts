import { useQuery } from "@tanstack/react-query";
import { fetchOdometer } from "../service/user-preferences-service";

export const odometerKeys = {
  all: ["user-preferences"] as const,
};

export function useOdometer() {
  return useQuery({
    queryKey: odometerKeys.all,
    queryFn: fetchOdometer,
  });
}

