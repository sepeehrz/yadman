import { apiClient } from "@/lib/api";
import type {
  CreateInsuranceInput,
  CreateServiceInput,
  CreateTollInput,
  CreateVehicleInput,
  ExpiringReminder,
  Insurance,
  Toll,
  UpdateTollInput,
  UpdateVehicleInput,
  Vehicle,
  VehicleService,
} from "../types";

export async function getVehicles(): Promise<Vehicle[]> {
  const { data } = await apiClient.get<Vehicle[]>("/vehicles");
  return data;
}

export async function createVehicle(
  input: CreateVehicleInput,
): Promise<Vehicle> {
  const { data } = await apiClient.post<Vehicle>("/vehicles", input);
  return data;
}

export async function updateVehicle(
  vehicleId: string,
  input: UpdateVehicleInput,
): Promise<Vehicle> {
  const { data } = await apiClient.patch<Vehicle>(
    `/vehicles/${vehicleId}`,
    input,
  );
  return data;
}

export async function deleteVehicle(vehicleId: string): Promise<void> {
  await apiClient.delete(`/vehicles/${vehicleId}`);
}

export async function getVehicleServices(
  vehicleId: string,
): Promise<VehicleService[]> {
  const { data } = await apiClient.get<VehicleService[]>(
    `/vehicles/${vehicleId}/services`,
  );
  return data;
}

export async function createVehicleService(
  vehicleId: string,
  input: CreateServiceInput,
): Promise<VehicleService> {
  const { data } = await apiClient.post<VehicleService>(
    `/vehicles/${vehicleId}/services`,
    input,
  );
  return data;
}

export async function deleteVehicleService(
  vehicleId: string,
  serviceId: string,
): Promise<void> {
  await apiClient.delete(`/vehicles/${vehicleId}/services/${serviceId}`);
}

export async function getInsurances(vehicleId: string): Promise<Insurance[]> {
  const { data } = await apiClient.get<Insurance[]>(
    `/vehicles/${vehicleId}/insurances`,
  );
  return data;
}

export async function createInsurance(
  vehicleId: string,
  input: CreateInsuranceInput,
): Promise<Insurance> {
  const { data } = await apiClient.post<Insurance>(
    `/vehicles/${vehicleId}/insurances`,
    input,
  );
  return data;
}

export async function deleteInsurance(
  vehicleId: string,
  insuranceId: string,
): Promise<void> {
  await apiClient.delete(`/vehicles/${vehicleId}/insurances/${insuranceId}`);
}

export async function getTolls(vehicleId: string): Promise<Toll[]> {
  const { data } = await apiClient.get<Toll[]>(`/vehicles/${vehicleId}/tolls`);
  return data;
}

export async function createToll(
  vehicleId: string,
  input: CreateTollInput,
): Promise<Toll> {
  const { data } = await apiClient.post<Toll>(
    `/vehicles/${vehicleId}/tolls`,
    input,
  );
  return data;
}

export async function updateToll(
  vehicleId: string,
  tollId: string,
  input: UpdateTollInput,
): Promise<Toll> {
  const { data } = await apiClient.patch<Toll>(
    `/vehicles/${vehicleId}/tolls/${tollId}`,
    input,
  );
  return data;
}

export async function deleteToll(
  vehicleId: string,
  tollId: string,
): Promise<void> {
  await apiClient.delete(`/vehicles/${vehicleId}/tolls/${tollId}`);
}

export async function getExpiringReminders(
  days = 30,
  vehicleId?: string,
): Promise<ExpiringReminder[]> {
  const params = new URLSearchParams({ days: String(days) });
  if (vehicleId) {
    params.set("vehicleId", vehicleId);
  }
  const { data } = await apiClient.get<ExpiringReminder[]>(
    `/vehicles/expiring?${params}`,
  );
  return data;
}
