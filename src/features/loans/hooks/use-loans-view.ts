"use client";

import { useState } from "react";
import type { LoanItem } from "@/types";
import { useLoans, useUpdateLoan } from "./use-loans";

export const LOAN_FILTERS = [
  { id: "all", label: "همه وام‌ها" },
  { id: "mortgage", label: "مسکن" },
  { id: "auto", label: "خودرو" },
  { id: "hardware", label: "شخصی و کالا" },
] as const;

export type LoanFilter = (typeof LOAN_FILTERS)[number]["id"];

/** مدل داده‌ای ویوی وام‌ها — محاسبات مالی، فیلتر و اکشن‌ها در اینجا انجام می‌شود */
export function useLoansView() {
  const { data: loans = [], isLoading } = useLoans();
  const updateLoanMutation = useUpdateLoan();

  const [filter, setFilter] = useState<LoanFilter>("all");
  const [scheduleModalLoan, setScheduleModalLoan] = useState<LoanItem | null>(
    null,
  );

  const filteredLoans = loans.filter((loan) => {
    if (filter === "all") return true;
    return loan.category === filter;
  });

  const totalRemaining = loans.reduce(
    (acc, curr) => acc + (curr.paidThisCycle ? 0 : curr.remainingAmount),
    0,
  );
  const totalPaid = loans.reduce(
    (acc, curr) => acc + (curr.totalAmount - curr.remainingAmount),
    0,
  );
  const monthlyOutflow = loans.reduce(
    (acc, curr) => acc + curr.monthlyAmount,
    0,
  );
  const donePercent =
    totalPaid + totalRemaining > 0
      ? Math.round((totalPaid / (totalPaid + totalRemaining)) * 100)
      : 0;

  function togglePaid(loan: LoanItem): void {
    updateLoanMutation.mutate({
      loanId: loan.id,
      input: { paidThisCycle: !loan.paidThisCycle },
    });
  }

  return {
    loans,
    isLoading,
    filter,
    setFilter,
    filteredLoans,
    totalRemaining,
    totalPaid,
    monthlyOutflow,
    donePercent,
    isTogglingPayment: updateLoanMutation.isPending,
    togglePaid,
    scheduleModalLoan,
    openSchedule: setScheduleModalLoan,
    closeSchedule: () => setScheduleModalLoan(null),
  };
}
