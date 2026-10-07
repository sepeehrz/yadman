import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/common/toast";
import { isApiError } from "@/lib/api";
import {
  createInsurance,
  createToll,
  deleteInsurance,
  deleteToll,
  getInsurances,
  getTolls,
  updateToll,
} from "../service";
import type {
  CreateInsuranceInput,
  CreateTollInput,
  UpdateTollInput,
} from "../types";
import { vehicleKeys } from "./vehicle-query-keys";

function toMessage(error: unknown, fallback: string): string {
  return isApiError(error) && error.message ? error.message : fallback;
}

export function useInsurances(vehicleId: string | null) {
  return useQuery({
    queryKey: vehicleKeys.insurances(vehicleId ?? "none"),
    queryFn: () => getInsurances(vehicleId as string),
    enabled: vehicleId !== null,
  });
}

export function useCreateInsurance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehicleId,
      input,
    }: {
      vehicleId: string;
      input: CreateInsuranceInput;
    }) => createInsurance(vehicleId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.insurances(variables.vehicleId),
      });
      toast.success("بیمه‌نامه ثبت شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "ثبت بیمه‌نامه ناموفق بود"));
    },
  });
}

export function useDeleteInsurance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehicleId,
      insuranceId,
    }: {
      vehicleId: string;
      insuranceId: string;
    }) => deleteInsurance(vehicleId, insuranceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.insurances(variables.vehicleId),
      });
      toast.success("بیمه‌نامه حذف شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "حذف بیمه‌نامه ناموفق بود"));
    },
  });
}

export function useTolls(vehicleId: string | null) {
  return useQuery({
    queryKey: vehicleKeys.tolls(vehicleId ?? "none"),
    queryFn: () => getTolls(vehicleId as string),
    enabled: vehicleId !== null,
  });
}

export function useCreateToll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehicleId,
      input,
    }: {
      vehicleId: string;
      input: CreateTollInput;
    }) => createToll(vehicleId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.tolls(variables.vehicleId),
      });
      toast.success("عوارض ثبت شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "ثبت عوارض ناموفق بود"));
    },
  });
}

export function useUpdateToll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehicleId,
      tollId,
      input,
    }: {
      vehicleId: string;
      tollId: string;
      input: UpdateTollInput;
    }) => updateToll(vehicleId, tollId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.tolls(variables.vehicleId),
      });
      toast.success("وضعیت عوارض به‌روزرسانی شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "به‌روزرسانی عوارض ناموفق بود"));
    },
  });
}

export function useDeleteToll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehicleId,
      tollId,
    }: {
      vehicleId: string;
      tollId: string;
    }) => deleteToll(vehicleId, tollId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.tolls(variables.vehicleId),
      });
      toast.success("رکورد عوارض حذف شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "حذف عوارض ناموفق بود"));
    },
  });
}
