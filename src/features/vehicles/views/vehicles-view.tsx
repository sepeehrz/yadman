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
} from "../hooks/use-vehicles";
import { DocumentsTab } from "../components/documents-tab";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { ExpiringAlerts } from "../components/expiring-alerts";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { ServiceTab } from "../components/service-tab";
import { VehicleDetailCard } from "../components/vehicle-detail-card";
import { VehicleFormDialog } from "../components/vehicle-form-dialog";
import { VehicleList } from "../components/vehicle-list";

type VehiclesTab = "services" | "documents";

export function VehiclesView() {
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

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-28 space-y-4">
      <div className="pt-1">
        <span className="text-[11px] text-primary font-bold">
          مدیریت ناوگان شخصی
        </span>
        <h1 className="text-2xl sm:text-[26px] font-bold text-foreground tracking-tight">
          خودروها و سرویس‌ها
        </h1>
      </div>

      <ExpiringAlerts />

      {vehicles.isPending ? <LoadingSkeleton rows={3} /> : null}
      {vehicles.isError ? (
        <ErrorState
          message="بارگذاری خودروها ناموفق بود"
          onRetry={() => vehicles.refetch()}
        />
      ) : null}
      {vehicles.data && vehicles.data.length === 0 ? (
        <EmptyState
          icon="directions_car"
          title="هنوز خودرویی ثبت نشده"
          hint="اولین خودرو را اضافه کنید تا سرویس‌ها، بیمه و عوارض را مدیریت کنید"
          actionLabel="ثبت اولین خودرو"
          onAction={openCreate}
        />
      ) : null}

      {list.length > 0 ? (
        <VehicleList
          vehicles={list}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={openCreate}
        />
      ) : null}

      {selected ? (
        <VehicleDetailCard
          vehicle={selected}
          isDeleting={deleteVehicle.isPending}
          onEdit={openEdit}
          onDelete={() => {
            void (async () => {
              const ok = await confirm({
                title: "حذف خودرو",
                message: `«${selected.name}» برای همیشه حذف شود؟ این عمل قابل بازگشت نیست.`,
                confirmLabel: "حذف خودرو",
              });
              if (ok) {
                deleteVehicle.mutate(selected.id, {
                  onSuccess: () => setSelectedId(null),
                });
              }
            })();
          }}
        />
      ) : null}

      {selected ? (
        <div className="p-1 bg-primary/10 rounded-xl grid grid-cols-2">
          <button
            onClick={() => setActiveTab("services")}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "services"
                ? "bg-card text-primary shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            سرویس‌های دوره‌ای
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "documents"
                ? "bg-card text-primary shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            بیمه و عوارض
          </button>
        </div>
      ) : null}

      {selected && activeTab === "services" ? (
        <ServiceTab
          vehicleId={selected.id}
          defaultOdometer={selected.odometerKm}
        />
      ) : null}
      {selected && activeTab === "documents" ? (
        <DocumentsTab vehicleId={selected.id} />
      ) : null}

      <VehicleFormDialog
        open={dialogOpen}
        initial={editing ? selected : null}
        pending={createVehicle.isPending || updateVehicle.isPending}
        onClose={closeDialog}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
