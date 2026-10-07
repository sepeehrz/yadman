import { faNum, usd, usdInt } from "@/lib/format";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  totalRemaining: number;
  totalPaid: number;
  monthlyOutflow: number;
  donePercent: number;
  activeLoanCount: number;
}

/**
 * بنر خلاصه مالی. گرادیان از توکن‌های chart/primary ساخته شده تا در هر دو
 * حالت روشن و تاریک تیره بماند و متن روشن روی آن خوانا باشد.
 */
export function LoanSummaryBanner({
  totalRemaining,
  totalPaid,
  monthlyOutflow,
  donePercent,
  activeLoanCount,
}: IProps) {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary via-chart-2 to-chart-4 text-primary-foreground p-5 sm:p-6 shadow-xl">
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-success/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-primary-foreground/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-primary-foreground/80 block mb-1">
              کل بدهی باقی‌مانده
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-foreground" dir="ltr">
                {usd(totalRemaining)}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 backdrop-blur-md flex items-center justify-center text-primary-foreground">
            <AppIcon name="account_balance" className="size-[24px]" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-primary-foreground/80">
              پرداخت‌شده <span dir="ltr">{usdInt(totalPaid)}</span>
            </span>
            <span className="font-bold text-success">{faNum(donePercent)}٪ تکمیل</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-primary-foreground/20 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-success via-success to-primary-foreground/40 transition-all duration-700"
              style={{ width: `${Math.min(100, donePercent)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="rounded-xl bg-primary-foreground/10 backdrop-blur-md p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-primary-foreground/70 font-medium">خروجی ماهانه</span>
            <span className="text-sm sm:text-base text-primary-foreground font-extrabold tracking-tight mt-0.5" dir="ltr">
              {usdInt(monthlyOutflow)}
              <span className="text-[11px] font-normal text-primary-foreground/70">/ماه</span>
            </span>
          </div>
          <div className="rounded-xl bg-primary-foreground/10 backdrop-blur-md p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-primary-foreground/70 font-medium">سررسید بعدی</span>
            <span className="text-sm sm:text-base text-primary-foreground font-extrabold tracking-tight mt-0.5">
              ۵ آبان <span className="text-[11px] font-normal text-primary-foreground/80" dir="ltr">($450)</span>
            </span>
          </div>
          <div className="rounded-xl bg-primary-foreground/10 backdrop-blur-md p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-primary-foreground/70 font-medium">وام‌های فعال</span>
            <span className="text-sm sm:text-base text-primary-foreground font-extrabold tracking-tight mt-0.5">
              {faNum(activeLoanCount)} فعال
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
