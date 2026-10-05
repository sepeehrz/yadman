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

export async function updateOdometer(odometerKm: number): Promise<UserPreferencesDto> {
  const { data } = await apiClient.patch<UserPreferencesDto>(
    "/user-preferences",
    { odometerKm },
  );
  return data;
}
