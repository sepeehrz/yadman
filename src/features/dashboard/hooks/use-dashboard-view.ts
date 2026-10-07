"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useReminders } from "@/features/tasks/hooks/use-reminders";
import { useLoans, useUpdateLoan } from "@/features/loans/hooks/use-loans";
import { useOdometer } from "./use-odometer";
import { useTimeline } from "./use-timeline";

export const TIMELINE_FILTERS = [
  { id: "all", label: "همه رویدادها" },
  { id: "vehicles", label: "خودرو" },
  { id: "finance", label: "مالی" },
  { id: "reminders", label: "یادآورها" },
] as const;

export type TimelineFilter = (typeof TIMELINE_FILTERS)[number]["id"];

/** مدل داده‌ای داشبورد — تمام محاسبات و اکشن‌ها؛ ویو فقط رندر می‌کند */
export function useDashboardView() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: reminders = [] } = useReminders();
  const { data: loans = [] } = useLoans();
  const { data: timeline = [] } = useTimeline();
  const { data: preferences } = useOdometer();
  const updateLoanMutation = useUpdateLoan();

  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("all");

  const pendingTasksCount = reminders.filter((task) => !task.done).length;
  const upcomingLoansCount = loans.filter((loan) => !loan.paidThisCycle).length;
  const dueLoans = loans
    .filter((loan) => !loan.paidThisCycle)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);
  const odometerKm = preferences?.odometerKm ?? 0;

  const filteredTimeline = timeline.filter((item) => {
    if (timelineFilter === "all") return true;
    if (timelineFilter === "vehicles") return item.category === "auto";
    if (timelineFilter === "finance") return item.category === "finance";
    if (timelineFilter === "reminders")
      return item.category === "health" || item.category === "travel";
    return true;
  });

  function payLoan(loanId: string): void {
    updateLoanMutation.mutate({ loanId, input: { paidThisCycle: true } });
  }

  function goToTasks(): void {
    router.push("/tasks");
  }

  return {
    user,
    timeline,
    timelineFilter,
    setTimelineFilter,
    filteredTimeline,
    pendingTasksCount,
    upcomingLoansCount,
    dueLoans,
    odometerKm,
    isPayingLoan: updateLoanMutation.isPending,
    payLoan,
    goToTasks,
  };
}
