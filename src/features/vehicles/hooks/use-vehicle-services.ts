import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/common/toast";
import { isApiError } from "@/lib/api";
import {
  createVehicleService,
  deleteVehicleService,
  getServiceCategories,
  getVehicleServices,
  updateVehicleService,
} from "../service";
import type { CreateServiceInput, UpdateServiceInput } from "../types";
import { vehicleKeys } from "./vehicle-query-keys";

function toMessage(error: unknown, fallback: string): string {
  return isApiError(error) && error.message ? error.message : fallback;
}

export function useServiceCategories() {
  return useQuery({
    queryKey: vehicleKeys.categories,
    queryFn: getServiceCategories,
    staleTime: 5 * 60_000,
  });
}

export function useVehicleServices(vehicleId: string | null) {
  return useQuery({
    queryKey: vehicleKeys.services(vehicleId ?? "none"),
    queryFn: () => getVehicleServices(vehicleId as string),
    enabled: vehicleId !== null,
  });
}

export function useCreateVehicleService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vehicleId, input }: { vehicleId: string; input: CreateServiceInput }) =>
      createVehicleService(vehicleId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.services(variables.vehicleId),
      });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      toast.success("سرویس جدید ثبت شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "ثبت سرویس ناموفق بود"));
    },
  });
}

export function useUpdateVehicleService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehicleId,
      serviceId,
      input,
    }: {
      vehicleId: string;
      serviceId: string;
      input: UpdateServiceInput;
    }) => updateVehicleService(vehicleId, serviceId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.services(variables.vehicleId),
      });
      toast.success("سرویس به‌روزرسانی شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "به‌روزرسانی سرویس ناموفق بود"));
    },
  });
}

export function useDeleteVehicleService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vehicleId, serviceId }: { vehicleId: string; serviceId: string }) =>
      deleteVehicleService(vehicleId, serviceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.services(variables.vehicleId),
      });
      toast.success("رکورد سرویس حذف شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "حذف سرویس ناموفق بود"));
    },
  });
}
