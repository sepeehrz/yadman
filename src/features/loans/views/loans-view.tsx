"use client";

import { EmptyState } from "@/components/common/empty-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { faNum, usd, usdInt } from "@/lib/format";
import { AppIcon } from "@/components/ui/app-icon";
import { LOAN_FILTERS, useLoansView } from "@/features/loans/hooks/use-loans-view";
import { LoanScheduleDialog } from "@/features/loans/components/loan-schedule-dialog";
import { LoanSummaryBanner } from "@/features/loans/components/loan-summary-banner";

export function LoansView() {
  const model = useLoansView();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-1 pb-28 space-y-4">
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-bold text-muted-foreground block">شفافیت مالی</span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            وام‌ها و اقساط
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 text-foreground shadow-xs">
          <AppIcon name="verified_user" className="size-[16px] text-success" />
          <span className="text-xs font-bold">حالت اعتماد بالا</span>
        </div>
      </div>

      <LoanSummaryBanner
        totalRemaining={model.totalRemaining}
        totalPaid={model.totalPaid}
        monthlyOutflow={model.monthlyOutflow}
        donePercent={model.donePercent}
        activeLoanCount={model.loans.length}
      />

      {/* فیلترها */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {LOAN_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => model.setFilter(f.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs transition-all flex items-center gap-1.5 ${
              model.filter === f.id
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "bg-primary/5 text-muted-foreground hover:bg-primary/10 font-semibold"
            }`}
          >
            <span>{f.label}</span>
            {f.id === "all" && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  model.filter === "all" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-foreground"
                }`}
              >
                {faNum(model.loans.length)}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-base text-foreground">بازپرداخت‌های زمان‌بندی‌شده</span>
          <span className="text-xs text-primary font-bold">تایم‌لاین</span>
        </div>

        {model.isLoading && <LoadingSkeleton rows={3} />}

        {!model.isLoading && model.filteredLoans.length === 0 && (
          <EmptyState
            icon="account_balance_wallet"
            title="هنوز وامی ثبت نشده"
            hint="اولین وام یا قسط خود را اضافه کنید تا مدیریتش کنیم."
          />
        )}

        {model.filteredLoans.map((loan) => {
          return (
            <div
              key={loan.id}
              className={`rounded-[20px] bg-card p-4 sm:p-5 shadow-xs border transition-all duration-300 flex flex-col gap-3.5 ${
                loan.paidThisCycle ? "border-success bg-background/70 scale-[0.99]" : "border-border/80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/5 text-primary">
                    <AppIcon name={loan.icon} className="size-[24px]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-foreground truncate">{loan.title}</h3>
                    <p className="text-xs text-muted-foreground" dir="ltr">{loan.bank}</p>
                  </div>
                </div>

                <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-foreground text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {loan.dueNotice}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground block">قسط ماهانه</span>
                  <span className="text-lg sm:text-xl font-extrabold text-foreground" dir="ltr">
                    {usd(loan.monthlyAmount)}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-muted-foreground block">مانده</span>
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground" dir="ltr">
                    {usdInt(loan.remainingAmount)} of {usdInt(loan.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    {faNum(loan.paidInstallments)} از {faNum(loan.totalInstallments)} قسط پرداخت شد
                  </span>
                  <span className="font-bold text-primary">
                    {faNum(Math.round(loan.progressPercent * 10) / 10)}٪
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-primary/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-primary"
                    style={{ width: `${loan.progressPercent}%` }}
                  />
                </div>
              </div>

              {loan.linkedAccount && (
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-primary/5 text-muted-foreground border border-primary/60">
                  <div className="flex items-center gap-2">
                    <AppIcon name="credit_card" className="size-[18px] text-muted-foreground" />
                    <span className="text-xs font-medium" dir="ltr">{loan.linkedAccount}</span>
                  </div>
                  <span className="text-[10px] font-bold text-success flex items-center gap-1">
                    <AppIcon name="autorenew" className="size-[14px]" />{" "}
                    {loan.autoPay ? "پرداخت خودکار روشن" : "پرداخت خودکار خاموش"}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => model.togglePaid(loan)}
                  disabled={model.isTogglingPayment}
                  className={`h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-60 ${
                    loan.paidThisCycle
                      ? "bg-success/30 text-success border border-success/40"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  <AppIcon name={loan.paidThisCycle ? "task_alt" : "done"} className="size-[18px]" />
                  <span>{loan.paidThisCycle ? "پرداخت شد! 🎉" : "ثبت پرداخت"}</span>
                </button>
                <button
                  onClick={() => model.openSchedule(loan)}
                  className="h-11 rounded-xl bg-primary/5 text-foreground text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary/10 transition-all"
                >
                  <AppIcon name="calendar_month" className="size-[18px]" />
                  <span>جدول اقساط</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <LoanScheduleDialog loan={model.scheduleModalLoan} onClose={model.closeSchedule} />
    </div>
  );
}
