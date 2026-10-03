export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  details: () => [...vehicleKeys.all, "detail"] as const,
  detail: (vehicleId: string) => [...vehicleKeys.details(), vehicleId] as const,
  services: (vehicleId: string) =>
    [...vehicleKeys.all, "services", vehicleId] as const,
  insurances: (vehicleId: string) =>
    [...vehicleKeys.all, "insurances", vehicleId] as const,
  tolls: (vehicleId: string) =>
    [...vehicleKeys.all, "tolls", vehicleId] as const,
  categories: ["service-categories"] as const,
  expiring: (days: number, vehicleId?: string) =>
    ["vehicles-expiring", days, vehicleId ?? "all"] as const,
};
