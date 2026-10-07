import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/common/toast";
import { isApiError } from "@/lib/api";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "../service";
import type { CreateVehicleInput, UpdateVehicleInput } from "../types";
import { vehicleKeys } from "./vehicle-query-keys";

function toMessage(error: unknown, fallback: string): string {
  return isApiError(error) && error.message ? error.message : fallback;
}

export function useVehicles() {
  return useQuery({
    queryKey: vehicleKeys.lists(),
    queryFn: getVehicles,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVehicleInput) => createVehicle(input),
    onSuccess: (vehicle) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      toast.success(`خودرو «${vehicle.name}» ثبت شد`);
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "ثبت خودرو ناموفق بود"));
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehicleId,
      input,
    }: {
      vehicleId: string;
      input: UpdateVehicleInput;
    }) => updateVehicle(vehicleId, input),
    onSuccess: (vehicle) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.detail(vehicle.id),
      });
      toast.success("مشخصات خودرو به‌روزرسانی شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "به‌روزرسانی خودرو ناموفق بود"));
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vehicleId: string) => deleteVehicle(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      toast.success("خودرو حذف شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "حذف خودرو ناموفق بود"));
    },
  });
}
