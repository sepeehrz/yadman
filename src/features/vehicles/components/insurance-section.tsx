"use client";

import { useState } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { formatFaDate } from "@/utils";
import type { CreateInsuranceInput } from "../types";
import {
  useCreateInsurance,
  useDeleteInsurance,
  useInsurances,
} from "../hooks/use-vehicle-documents";
import {
  INSURANCE_TYPE_LABEL,
  dueLabel,
  severityStyle,
} from "../utils/reminder-helpers";
import { daysUntil } from "@/utils";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { InsuranceFormDialog } from "./insurance-form-dialog";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  vehicleId: string;
}

export function InsuranceSection({ vehicleId }: IProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const insurances = useInsurances(vehicleId);
  const createInsurance = useCreateInsurance();
  const deleteInsurance = useDeleteInsurance();
  const confirm = useConfirm();

  function handleSubmit(input: CreateInsuranceInput): void {
    createInsurance.mutate(
      { vehicleId, input },
      { onSuccess: () => setDialogOpen(false) },
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-foreground">بیمه‌نامه‌ها</h3>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <AppIcon name="add_circle" className="size-[16px]" />
          بیمه جدید
        </button>
      </div>

      {insurances.isPending ? <LoadingSkeleton rows={2} /> : null}
      {insurances.isError ? (
        <ErrorState
          message="بارگذاری بیمه‌نامه‌ها ناموفق بود"
          onRetry={() => insurances.refetch()}
        />
      ) : null}
      {insurances.data && insurances.data.length === 0 ? (
        <EmptyState
          icon="security"
          title="بیمه‌ای ثبت نشده"
          hint="اولین بیمه‌نامه این خودرو را ثبت کنید"
        />
      ) : null}

      {insurances.data?.map((insurance) => {
        const remaining = daysUntil(insurance.endDate);
        const severity =
          remaining !== null && remaining < 0
            ? "overdue"
            : remaining !== null && remaining <= 30
              ? "urgent"
              : "ok";
        const style = severityStyle(severity);
        return (
          <div
            key={insurance.id}
            className="bg-card p-4 rounded-2xl shadow-xs border border-border/80"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-primary/15 text-foreground flex items-center justify-center flex-shrink-0">
                  <AppIcon name="security" className="size-[22px]" />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    بیمه {INSURANCE_TYPE_LABEL[insurance.type]} •{" "}
                    {insurance.company}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formatFaDate(insurance.startDate)} تا{" "}
                    {formatFaDate(insurance.endDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  void (async () => {
                    const ok = await confirm({
                      title: "حذف بیمه‌نامه",
                      message: `بیمه ${INSURANCE_TYPE_LABEL[insurance.type]} «${insurance.company}» حذف شود؟`,
                      confirmLabel: "حذف بیمه‌نامه",
                    });
                    if (ok) {
                      deleteInsurance.mutate({
                        vehicleId,
                        insuranceId: insurance.id,
                      });
                    }
                  })();
                }}
                disabled={deleteInsurance.isPending}
                aria-label={`حذف بیمه ${insurance.company}`}
                className="text-[11px] font-bold text-destructive hover:underline disabled:opacity-50"
              >
                حذف
              </button>
            </div>
            <div className="pt-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${style.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {dueLabel(remaining, insurance.endDate)}
              </span>
            </div>
          </div>
        );
      })}

      <InsuranceFormDialog
        open={dialogOpen}
        pending={createInsurance.isPending}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
