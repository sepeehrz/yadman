"use client";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { useVehiclesView } from "../hooks/use-vehicles-view";
import { DocumentsTab } from "../components/documents-tab";
import { ExpiringAlerts } from "../components/expiring-alerts";
import { ServiceTab } from "../components/service-tab";
import { VehicleDetailCard } from "../components/vehicle-detail-card";
import { VehicleFormDialog } from "../components/vehicle-form-dialog";
import { VehicleList } from "../components/vehicle-list";

export function VehiclesView() {
  const model = useVehiclesView();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-1 pb-28 space-y-4">
      <div className="pt-1">
        <span className="text-[11px] text-primary font-bold">
          مدیریت ناوگان شخصی
        </span>
        <h1 className="text-2xl sm:text-[26px] font-bold text-foreground tracking-tight">
          خودروها و سرویس‌ها
        </h1>
      </div>

      <ExpiringAlerts />

      {model.vehicles.isPending ? <LoadingSkeleton rows={3} /> : null}
      {model.vehicles.isError ? (
        <ErrorState
          message="بارگذاری خودروها ناموفق بود"
          onRetry={() => model.refetch()}
        />
      ) : null}
      {model.vehicles.data && model.vehicles.data.length === 0 ? (
        <EmptyState
          icon="directions_car"
          title="هنوز خودرویی ثبت نشده"
          hint="اولین خودرو را اضافه کنید تا سرویس‌ها، بیمه و عوارض را مدیریت کنید"
          actionLabel="ثبت اولین خودرو"
          onAction={model.openCreate}
        />
      ) : null}

      {model.list.length > 0 ? (
        <VehicleList
          vehicles={model.list}
          selectedId={model.selected?.id ?? null}
          onSelect={model.setSelectedId}
          onAdd={model.openCreate}
        />
      ) : null}

      {model.selected ? (
        <VehicleDetailCard
          vehicle={model.selected}
          isDeleting={model.isDeleting}
          onEdit={model.openEdit}
          onDelete={model.requestDelete}
        />
      ) : null}

      {model.selected ? (
        <div className="p-1 bg-primary/10 rounded-xl grid grid-cols-2">
          <button
            onClick={() => model.setActiveTab("services")}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              model.activeTab === "services"
                ? "bg-card text-primary shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            سرویس‌های دوره‌ای
          </button>
          <button
            onClick={() => model.setActiveTab("documents")}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              model.activeTab === "documents"
                ? "bg-card text-primary shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            بیمه و عوارض
          </button>
        </div>
      ) : null}

      {model.selected && model.activeTab === "services" ? (
        <ServiceTab
          vehicleId={model.selected.id}
          defaultOdometer={model.selected.odometerKm}
        />
      ) : null}
      {model.selected && model.activeTab === "documents" ? (
        <DocumentsTab vehicleId={model.selected.id} />
      ) : null}

      <VehicleFormDialog
        open={model.dialogOpen}
        initial={model.editing ? model.selected : null}
        pending={model.isSaving}
        onClose={model.closeDialog}
        onSubmit={model.handleSubmit}
      />
    </div>
  );
}
