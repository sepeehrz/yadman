"use client";

import { useState } from "react";
import { formatFaDate, toISODateOnly } from "@/utils";
import type { CreateTollInput } from "../types";
import {
  useCreateToll,
  useDeleteToll,
  useTolls,
  useUpdateToll,
} from "../hooks/use-vehicle-documents";
import { dueLabel } from "../utils/reminder-helpers";
import { daysUntil } from "@/utils";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { LoadingSkeleton } from "./loading-skeleton";
import { TollFormDialog } from "./toll-form-dialog";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  vehicleId: string;
}

export function TollSection({ vehicleId }: IProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const tolls = useTolls(vehicleId);
  const createToll = useCreateToll();
  const updateToll = useUpdateToll();
  const deleteToll = useDeleteToll();

  function handleSubmit(input: CreateTollInput): void {
    createToll.mutate(
      { vehicleId, input },
      { onSuccess: () => setDialogOpen(false) },
    );
  }

  function togglePaid(tollId: string, paid: boolean): void {
    updateToll.mutate({
      vehicleId,
      tollId,
      input: paid
        ? { paid, paidAt: toISODateOnly(new Date()) }
        : { paid, paidAt: null },
    });
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-[#0b1c30]">عوارض سالیانه</h3>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-1 text-xs font-bold text-[#3525cd] hover:underline"
        >
          <AppIcon name="add_circle" className="size-[16px]" />
          عوارض جدید
        </button>
      </div>

      {tolls.isPending ? <LoadingSkeleton rows={2} /> : null}
      {tolls.isError ? (
        <ErrorState
          message="بارگذاری عوارض ناموفق بود"
          onRetry={() => tolls.refetch()}
        />
      ) : null}
      {tolls.data && tolls.data.length === 0 ? (
        <EmptyState
          icon="receipt_long"
          title="عوارضی ثبت نشده"
          hint="عوارض سالیانه این خودرو را ثبت و پیگیری کنید"
        />
      ) : null}

      {tolls.data?.map((toll) => (
        <div
          key={toll.id}
          className={`bg-white p-4 rounded-2xl shadow-xs border transition-all ${
            toll.paid ? "border-[#4edea3]/60 opacity-80" : "border-[#e2e8f0]/80"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => togglePaid(toll.id, !toll.paid)}
                disabled={updateToll.isPending}
                aria-label={
                  toll.paid
                    ? `برگرداندن عوارض ${toll.year}`
                    : `ثبت پرداخت عوارض ${toll.year}`
                }
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 ${
                  toll.paid
                    ? "bg-[#006e4b] text-white"
                    : "bg-[#eff4ff] text-transparent hover:bg-[#e5eeff] border border-[#c7c4d8]"
                }`}
              >
                <AppIcon name="check" className="size-[16px]" />
              </button>
              <div>
                <h4 className="font-bold text-sm text-[#0b1c30]">
                  عوارض سال {toll.year}
                </h4>
                <p className="text-xs text-[#545f73]">
                  {toll.dueDate
                    ? `مهلت: ${formatFaDate(toll.dueDate)}`
                    : "بدون مهلت ثبت‌شده"}
                </p>
              </div>
            </div>
            <div className="text-left flex-shrink-0">
              <span className="text-sm font-extrabold text-[#0b1c30]">
                {toll.amount.toLocaleString("fa-IR")}
              </span>
              <button
                onClick={() =>
                  deleteToll.mutate({ vehicleId, tollId: toll.id })
                }
                disabled={deleteToll.isPending}
                aria-label={`حذف عوارض ${toll.year}`}
                className="text-[11px] font-bold text-[#ba1a1a] hover:underline block mt-1 disabled:opacity-50"
              >
                حذف
              </button>
            </div>
          </div>
          {!toll.paid && toll.dueDate ? (
            <p className="text-[11px] font-semibold text-amber-700 pt-2">
              {dueLabel(daysUntil(toll.dueDate), toll.dueDate)}
            </p>
          ) : null}
          {toll.paid ? (
            <p className="text-[11px] font-bold text-[#006e4b] pt-2 flex items-center gap-1">
              <AppIcon name="verified" className="size-[14px]" />
              پرداخت شد{toll.paidAt ? ` • ${formatFaDate(toll.paidAt)}` : ""}
            </p>
          ) : null}
        </div>
      ))}

      <TollFormDialog
        open={dialogOpen}
        pending={createToll.isPending}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
