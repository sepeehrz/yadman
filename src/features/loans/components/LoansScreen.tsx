"use client";

import { useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import { useLifeHub } from "@/store/LifeHubContext";
import { faNum, usd, usdInt } from "@/lib/format";
import type { LoanItem } from "@/lib/types";
import { AppIcon } from "@/components/ui/app-icon";

const FILTERS = [
  { id: "all", label: "همه وام‌ها" },
  { id: "mortgage", label: "مسکن" },
  { id: "auto", label: "خودرو" },
  { id: "hardware", label: "شخصی و کالا" },
] as const;

export function LoansScreen() {
  const { loans, toggleMarkPaid, setQuickAddOpen, showToast } = useLifeHub();
  const [filter, setFilter] =
    useState<(typeof FILTERS)[number]["id"]>("all");
  const [scheduleModalLoan, setScheduleModalLoan] = useState<LoanItem | null>(null);

  const filteredLoans = loans.filter((loan) => {
    if (filter === "all") return true;
    return loan.category === filter;
  });

  const totalRemaining = loans.reduce(
    (acc, curr) => acc + (curr.paidThisCycle ? 0 : curr.remainingAmount),
    0,
  );
  const totalPaid = loans.reduce((acc, curr) => acc + (curr.totalAmount - curr.remainingAmount), 0);
  const monthlyOutflow = loans.reduce((acc, curr) => acc + curr.monthlyAmount, 0);
  const donePercent =
    totalPaid + totalRemaining > 0 ? Math.round((totalPaid / (totalPaid + totalRemaining)) * 100) : 0;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-28 space-y-4">
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-bold text-[#545f73] block">شفافیت مالی</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight">
            وام‌ها و اقساط
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d5e0f8] text-[#111c2d] shadow-xs">
          <AppIcon name="verified_user" className="size-[16px] text-[#005338]" />
          <span className="text-xs font-bold">حالت اعتماد بالا</span>
        </div>
      </div>

      {/* بنر خلاصه مالی */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#213145] via-[#3525cd] to-[#213145] text-white p-5 sm:p-6 shadow-xl">
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#4edea3]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#c3c0ff]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-[#c3c0ff] block mb-1">
                کل بدهی باقی‌مانده
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white" dir="ltr">
                  {usd(totalRemaining)}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#e2dfff]">
              <AppIcon name="account_balance" className="size-[24px]" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#d3e4fe]">
                پرداخت‌شده <span dir="ltr">{usdInt(totalPaid)}</span>
              </span>
              <span className="font-bold text-[#6ffbbe]">{faNum(donePercent)}٪ تکمیل</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/15 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6ffbbe] via-[#4edea3] to-[#e2dfff] transition-all duration-700"
                style={{ width: `${Math.min(100, donePercent)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="rounded-xl bg-white/10 backdrop-blur-md p-2.5 flex flex-col justify-between">
              <span className="text-[10px] text-[#d3e4fe] font-medium">خروجی ماهانه</span>
              <span className="text-sm sm:text-base text-white font-extrabold tracking-tight mt-0.5" dir="ltr">
                {usdInt(monthlyOutflow)}
                <span className="text-[11px] font-normal text-[#d3e4fe]">/ماه</span>
              </span>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-md p-2.5 flex flex-col justify-between">
              <span className="text-[10px] text-[#d3e4fe] font-medium">سررسید بعدی</span>
              <span className="text-sm sm:text-base text-[#6ffbbe] font-extrabold tracking-tight mt-0.5">
                ۵ آبان <span className="text-[11px] font-normal text-white" dir="ltr">($450)</span>
              </span>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-md p-2.5 flex flex-col justify-between">
              <span className="text-[10px] text-[#d3e4fe] font-medium">وام‌های فعال</span>
              <span className="text-sm sm:text-base text-white font-extrabold tracking-tight mt-0.5">
                {faNum(loans.length)} فعال
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* فیلترها */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs transition-all flex items-center gap-1.5 ${
              filter === f.id
                ? "bg-[#4f46e5] text-white shadow-xs font-bold"
                : "bg-[#eff4ff] text-[#464555] hover:bg-[#e5eeff] font-semibold"
            }`}
          >
            <span>{f.label}</span>
            {f.id === "all" && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === "all" ? "bg-white/20 text-white" : "bg-[#dce9ff] text-[#0b1c30]"
                }`}
              >
                {faNum(loans.length)}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-base text-[#0b1c30]">بازپرداخت‌های زمان‌بندی‌شده</span>
          <span className="text-xs text-[#3525cd] font-bold">تایم‌لاین</span>
        </div>

        {filteredLoans.map((loan) => {
          const isMac = loan.id === "loan-3";
          const isCar = loan.id === "loan-2";

          return (
            <div
              key={loan.id}
              className={`rounded-[20px] bg-white p-4 sm:p-5 shadow-xs border transition-all duration-300 flex flex-col gap-3.5 ${
                loan.paidThisCycle ? "border-[#4edea3] bg-[#f8f9ff]/70 scale-[0.99]" : "border-[#e2e8f0]/80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isMac ? "bg-emerald-50 text-[#006e4b]" : "bg-[#eff4ff] text-[#3525cd]"
                    }`}
                  >
                    <AppIcon name={loan.icon} className="size-[24px]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-[#0b1c30] truncate">{loan.title}</h3>
                    <p className="text-xs text-[#545f73]" dir="ltr">{loan.bank}</p>
                  </div>
                </div>

                {isMac ? (
                  <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#005338] text-white text-[10px] font-bold shadow-xs">
                    <AppIcon name="local_fire_department" className="size-[13px]" />
                    ۲ ماه مانده!
                  </span>
                ) : (
                  <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d5e0f8] text-[#111c2d] text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd]" />
                    {loan.dueNotice}
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-[10px] font-bold text-[#545f73] block">
                    {isMac ? "موعد ۲۴ آبان" : "قسط ماهانه"}
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-[#0b1c30]" dir="ltr">
                    {usd(loan.monthlyAmount)}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-[#545f73] block">
                    {isCar ? "اصل باقی‌مانده" : "مانده"}
                  </span>
                  <span className={`text-xs sm:text-sm font-semibold ${isMac ? "text-[#006e4b]" : "text-[#464555]"}`} dir="ltr">
                    {usdInt(loan.remainingAmount)} of {usdInt(loan.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs text-[#545f73]">
                  <span>
                    {faNum(loan.paidInstallments)} از {faNum(loan.totalInstallments)} قسط پرداخت شد
                  </span>
                  <span className={`font-bold ${isMac ? "text-[#006e4b]" : "text-[#3525cd]"}`}>
                    {faNum(Math.round(loan.progressPercent * 10) / 10)}٪ {isMac && "تکمیل"}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isMac ? "bg-[#006e4b]" : "bg-[#4f46e5]"}`}
                    style={{ width: `${loan.progressPercent}%` }}
                  />
                </div>
              </div>

              {loan.linkedAccount && (
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#eff4ff] text-[#464555] border border-[#dce9ff]/60">
                  <div className="flex items-center gap-2">
                    <AppIcon name="credit_card" className="size-[18px] text-[#545f73]" />
                    <span className="text-xs font-medium" dir="ltr">{loan.linkedAccount}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#006e4b] flex items-center gap-1">
                    <AppIcon name="autorenew" className="size-[14px]" /> پرداخت خودکار روشن
                  </span>
                </div>
              )}

              {isCar ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      toggleMarkPaid(loan.id);
                      showToast(loan.paidThisCycle ? "به حالت در انتظار برگشت" : "پرداخت شد! 🎉");
                    }}
                    className={`h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                      loan.paidThisCycle
                        ? "bg-[#67f4b7]/30 text-[#005338] border border-[#006e4b]/40"
                        : "bg-[#4f46e5] text-white hover:bg-[#3525cd]"
                    }`}
                  >
                    <AppIcon name={loan.paidThisCycle ? "task_alt" : "done"} className="size-[18px]" />
                    <span>{loan.paidThisCycle ? "قسط مهر پرداخت شد! 🎉" : "ثبت پرداخت"}</span>
                  </button>
                  <button
                    onClick={() => setScheduleModalLoan(loan)}
                    className="h-11 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#e5eeff] transition-all"
                  >
                    <AppIcon name="calendar_month" className="size-[18px]" />
                    <span>جدول اقساط</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    toggleMarkPaid(loan.id);
                    showToast(loan.paidThisCycle ? "به حالت در انتظار برگشت" : "قسط این ماه پرداخت شد! 🎉");
                  }}
                  className={`w-full h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                    loan.paidThisCycle
                      ? "bg-[#67f4b7]/30 text-[#005338] border border-[#006e4b]/40"
                      : isMac
                        ? "bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]"
                        : "bg-[#4f46e5] text-white hover:bg-[#3525cd]"
                  }`}
                >
                  <AppIcon
                    name={loan.paidThisCycle ? "task_alt" : "check_circle"}
                    className={`size-[18px] ${
                      loan.paidThisCycle ? "text-[#005338]" : isMac ? "text-[#006e4b]" : "text-white"
                    }`}
                  />
                  <span>{loan.paidThisCycle ? "این ماه پرداخت شد! 🎉" : "ثبت پرداخت این ماه"}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setQuickAddOpen(true)}
        className="w-full py-3.5 rounded-2xl bg-[#eff4ff] text-[#3525cd] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#e5eeff] active:scale-[0.99] transition-all border border-[#dce9ff]"
      >
        <AppIcon name="add_circle" className="size-[20px]" />
        <span>افزودن وام / قسط جدید</span>
      </button>

      <BaseDialog
        open={scheduleModalLoan !== null}
        onClose={() => setScheduleModalLoan(null)}
        title={scheduleModalLoan?.title ?? "جدول استهلاک"}
        size="sm"
      >
        {scheduleModalLoan && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#0b1c30]">{scheduleModalLoan.title}</h3>
                <p className="text-xs text-[#545f73]">
                  <span dir="ltr">{scheduleModalLoan.bank}</span> • جدول استهلاک
                </p>
              </div>
              <button
                onClick={() => setScheduleModalLoan(null)}
                className="w-7 h-7 rounded-full bg-[#eff4ff] text-[#545f73] flex items-center justify-center hover:bg-[#e5eeff]"
              >
                <AppIcon name="close" className="size-[16px]" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar text-xs">
              {[
                { cycle: "قسط ۲۷", date: "۱۴ آبان ۱۴۰۳", amount: "$380.00", status: "نزدیک" },
                { cycle: "قسط ۲۸", date: "۱۴ آذر ۱۴۰۳", amount: "$380.00", status: "زمان‌بندی‌شده" },
                { cycle: "قسط ۲۹", date: "۱۴ دی ۱۴۰۳", amount: "$380.00", status: "زمان‌بندی‌شده" },
                { cycle: "قسط ۳۰", date: "۱۴ بهمن ۱۴۰۳", amount: "$380.00", status: "زمان‌بندی‌شده" },
              ].map((row, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#eff4ff] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0b1c30] block">{row.cycle}</span>
                    <span className="text-[11px] text-[#545f73]">{row.date}</span>
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-[#0b1c30] block" dir="ltr">{row.amount}</span>
                    <span className="text-[10px] font-semibold text-[#3525cd]">{row.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                showToast("جدول استهلاک خروجی گرفته شد");
                setScheduleModalLoan(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#4f46e5] text-white font-bold text-xs hover:bg-[#3525cd]"
            >
              خروجی PDF جدول استهلاک
            </button>
          </div>
        )}
      </BaseDialog>
    </div>
  );
}
