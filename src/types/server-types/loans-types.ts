import type { loans } from "@/database/schema/finance";

/** پارامترهای مسیر /api/loans/[loanId] */
export interface ILoanRouteParams {
  params: Promise<{ loanId: string }>;
}

export type LoanRow = typeof loans.$inferSelect;
