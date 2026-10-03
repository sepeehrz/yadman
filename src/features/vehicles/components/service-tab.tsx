"use client";

import { useState } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import type { CreateServiceInput } from "../types";
import {
  useCreateVehicleService,
  useDeleteVehicleService,
  useServiceCategories,
  useVehicleServices,
} from "../hooks/use-vehicle-services";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { ServiceFormDialog } from "./service-form-dialog";
import { ServiceHistoryList } from "./service-history-list";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  vehicleId: string;
  defaultOdometer: number;
}

export function ServiceTab({ vehicleId, defaultOdometer }: IProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const services = useVehicleServices(vehicleId);
  const categories = useServiceCategories();
  const createService = useCreateVehicleService();
  const deleteService = useDeleteVehicleService();
  const confirm = useConfirm();

  function handleSubmit(input: CreateServiceInput): void {
    createService.mutate(
      { vehicleId, input },
      { onSuccess: () => setDialogOpen(false) },
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-[#0b1c30]">تاریخچه سرویس‌ها</h3>
        <button
          onClick={() => setDialogOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-[#4f46e5] text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-[#3525cd]"
        >
          <AppIcon name="add" className="size-3.5" />
          ثبت سرویس
        </button>
      </div>

      {services.isPending ? <LoadingSkeleton rows={3} /> : null}
      {services.isError ? (
        <ErrorState
          message="بارگذاری سرویس‌ها ناموفق بود"
          onRetry={() => services.refetch()}
        />
      ) : null}
      {services.data && services.data.length === 0 ? (
        <EmptyState
          icon="build"
          title="سرویسی برای این خودرو ثبت نشده"
          hint="اولین سرویس را ثبت کنید تا تاریخچه ساخته شود"
        />
      ) : null}
      {services.data && services.data.length > 0 ? (
        <ServiceHistoryList
          services={services.data}
          deleting={deleteService.isPending}
          onDelete={(serviceId) => {
            void (async () => {
              const target = services.data?.find(
                (service) => service.id === serviceId,
              );
              const ok = await confirm({
                title: "حذف سرویس",
                message: target
                  ? `«${target.title}» از تاریخچه سرویس‌ها حذف شود؟`
                  : "این سرویس از تاریخچه حذف شود؟",
                confirmLabel: "حذف سرویس",
              });
              if (ok) {
                deleteService.mutate({ vehicleId, serviceId });
              }
            })();
          }}
        />
      ) : null}

      <ServiceFormDialog
        open={dialogOpen}
        categories={categories.data ?? []}
        defaultOdometer={defaultOdometer}
        pending={createService.isPending}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
