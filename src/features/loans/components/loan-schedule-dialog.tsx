import { BaseDialog } from "@/components/ui/dialog";
import { AppIcon } from "@/components/ui/app-icon";
import type { LoanItem } from "@/types";

interface IProps {
  loan: LoanItem | null;
  onClose: () => void;
}

/** دیالوگ جدول استهلاک وام انتخاب‌شده */
export function LoanScheduleDialog({ loan, onClose }: IProps) {
  return (
    <BaseDialog
      open={loan !== null}
      onClose={onClose}
      title={loan?.title ?? "جدول استهلاک"}
      size="sm"
    >
      {loan && (
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">
                {loan.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                <span dir="ltr">{loan.bank}</span> • جدول استهلاک
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-primary/5 text-muted-foreground flex items-center justify-center hover:bg-primary/10"
            >
              <AppIcon name="close" className="size-[16px]" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar text-xs">
            {[
              {
                cycle: "قسط ۲۷",
                date: "۱۴ آبان ۱۴۰۳",
                amount: "$380.00",
                status: "نزدیک",
              },
              {
                cycle: "قسط ۲۸",
                date: "۱۴ آذر ۱۴۰۳",
                amount: "$380.00",
                status: "زمان‌بندی‌شده",
              },
              {
                cycle: "قسط ۲۹",
                date: "۱۴ دی ۱۴۰۳",
                amount: "$380.00",
                status: "زمان‌بندی‌شده",
              },
              {
                cycle: "قسط ۳۰",
                date: "۱۴ بهمن ۱۴۰۳",
                amount: "$380.00",
                status: "زمان‌بندی‌شده",
              },
            ].map((row, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-primary/5 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-foreground block">
                    {row.cycle}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {row.date}
                  </span>
                </div>
                <div className="text-left">
                  <span className="font-bold text-foreground block" dir="ltr">
                    {row.amount}
                  </span>
                  <span className="text-[10px] font-semibold text-primary">
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90"
          >
            خروجی PDF جدول استهلاک
          </button>
        </div>
      )}
    </BaseDialog>
  );
}
