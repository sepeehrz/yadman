import { faNum } from "@/lib/format";
import type { loans } from "@/database/schema/finance";
import type { LoanItem } from "@/lib/types";

type LoanRow = typeof loans.$inferSelect;

const CATEGORY_ICONS: Record<string, string> = {
  mortgage: "home",
  auto: "directions_car",
  hardware: "devices_other",
  personal: "credit_card",
};

export function loanIconForCategory(category: string): string {
  return CATEGORY_ICONS[category] ?? "credit_card";
}

/** محاسبه فیلدهای مشتق وام — تنها منبع این منطق (سرور) */
export function computeLoanDerivedFields(input: {
  monthlyAmount: number;
  remainingAmount: number;
  totalAmount: number;
  dueDay: number;
  paidInstallments?: number;
  paidThisCycle?: boolean;
  category: string;
}) {
  const totalInstallments = Math.max(
    1,
    Math.round(input.totalAmount / Math.max(input.monthlyAmount, 1)),
  );
  const progressPercent =
    input.totalAmount > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((input.totalAmount - input.remainingAmount) / input.totalAmount) * 100,
          ),
        )
      : 0;

  return {
    totalInstallments,
    progressPercent,
    icon: loanIconForCategory(input.category),
    dueNotice: `موعد روز ${faNum(input.dueDay)}`,
    dueDate: `روز ${faNum(input.dueDay)}`,
  };
}

export function mapLoan(row: LoanRow): LoanItem {
  return {
    id: row.id,
    title: row.title,
    bank: row.bank,
    icon: row.icon,
    dueNotice: row.dueNotice,
    dueDate: row.dueDate,
    monthlyAmount: row.monthlyAmount,
    remainingAmount: row.remainingAmount,
    totalAmount: row.totalAmount,
    paidInstallments: row.paidInstallments,
    totalInstallments: row.totalInstallments,
    progressPercent: row.progressPercent,
    linkedAccount: row.linkedAccount ?? undefined,
    autoPay: row.autoPay,
    category: row.category as LoanItem["category"],
    paidThisCycle: row.paidThisCycle,
    badgeText: row.badgeText ?? undefined,
    badgeType: (row.badgeType as LoanItem["badgeType"]) ?? undefined,
  };
}
