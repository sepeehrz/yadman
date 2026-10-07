import { apiClient } from "@/lib/api";

export interface UserPreferencesDto {
  odometerKm: number;
}

export async function fetchOdometer(): Promise<UserPreferencesDto> {
  const { data } = await apiClient.get<UserPreferencesDto>(
    "/user-preferences",
  );
  return data;
}

