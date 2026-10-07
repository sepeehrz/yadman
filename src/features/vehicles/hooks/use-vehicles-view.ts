"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import type { CreateVehicleInput } from "../types";
import {
  useCreateVehicle,
  useDeleteVehicle,
  useUpdateVehicle,
  useVehicles,
} from "./use-vehicles";

export type VehiclesTab = "services" | "documents";

/** مدل ویوی خودروها — انتخاب، دیالوگ‌ها، موتاسیون‌ها؛ ویو فقط رندر می‌کند */
export function useVehiclesView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<VehiclesTab>("services");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const vehicles = useVehicles();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const confirm = useConfirm();

  const router = useRouter();
  const searchParams = useSearchParams();
  const addParamOpen = searchParams.get("add") === "vehicle";

  const list = vehicles.data ?? [];
  useEffect(() => {
    if (selectedId === null && list.length > 0) {
      setSelectedId(list[0].id);
    }
  }, [selectedId, list]);

  useEffect(() => {
    if (addParamOpen) {
      setEditing(false);
      setDialogOpen(true);
    }
  }, [addParamOpen]);

  function closeDialog(): void {
    setDialogOpen(false);
    if (addParamOpen) {
      router.replace("/vehicles");
    }
  }

  const selected = list.find((vehicle) => vehicle.id === selectedId) ?? null;

  function handleSubmit(input: CreateVehicleInput): void {
    if (editing && selected) {
      updateVehicle.mutate(
        { vehicleId: selected.id, input },
        { onSuccess: () => closeDialog() },
      );
      return;
    }
    createVehicle.mutate(input, {
      onSuccess: (vehicle) => {
        setSelectedId(vehicle.id);
        closeDialog();
      },
    });
  }

  function openCreate(): void {
    setEditing(false);
    setDialogOpen(true);
  }

  function openEdit(): void {
    setEditing(true);
    setDialogOpen(true);
  }

  function requestDelete(): void {
    if (!selected) return;
    void (async () => {
      const confirmed = await confirm({
        title: "حذف خودرو",
        message: `«${selected.name}» برای همیشه حذف شود؟ این عمل قابل بازگشت نیست.`,
        confirmLabel: "حذف خودرو",
      });
      if (confirmed) {
        deleteVehicle.mutate(selected.id, {
          onSuccess: () => setSelectedId(null),
        });
      }
    })();
  }

  return {
    vehicles,
    list,
    selected,
    setSelectedId,
    activeTab,
    setActiveTab,
    dialogOpen,
    editing,
    isSaving: createVehicle.isPending || updateVehicle.isPending,
    isDeleting: deleteVehicle.isPending,
    handleSubmit,
    openCreate,
    openEdit,
    closeDialog,
    requestDelete,
    refetch: vehicles.refetch,
  };
}
