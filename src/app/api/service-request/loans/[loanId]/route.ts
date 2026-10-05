import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { loans } from "@/database/schema/finance";
import { updateLoanSchema } from "@/features/loans/validations/loan-schema";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";
import { computeLoanDerivedFields, mapLoan } from "../loan-mappers";

interface IRouteParams {
  params: Promise<{ loanId: string }>;
}

export async function PATCH(request: Request, { params }: IRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { loanId } = await params;
    const body: unknown = await request.json();
    const parsed = updateLoanSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات وام معتبر نیست", 422);
    }
    const input = parsed.data;
    const db = getDb();

    const [current] = await db
      .select()
      .from(loans)
      .where(and(eq(loans.id, loanId), eq(loans.userId, user.userId)))
      .limit(1);
    if (!current) {
      return fail("وام پیدا نشد", 404);
    }

    const monthlyAmount = input.monthlyAmount ?? current.monthlyAmount;
    const totalAmount = input.totalAmount ?? current.totalAmount;
    let paidInstallments = current.paidInstallments;
    let remainingAmount = input.remainingAmount ?? current.remainingAmount;
    let paidThisCycle = input.paidThisCycle ?? current.paidThisCycle;

    // قاعده پرداخت دور: تیک پرداخت قسط ماه جاری مانده و شمارنده اقساط را جابه‌جا می‌کند
    if (
      input.paidThisCycle !== undefined &&
      input.paidThisCycle !== current.paidThisCycle
    ) {
      if (input.paidThisCycle) {
        paidInstallments = Math.min(
          current.totalInstallments,
          paidInstallments + 1,
        );
        remainingAmount = Math.max(0, remainingAmount - monthlyAmount);
      } else {
        paidInstallments = Math.max(0, paidInstallments - 1);
        remainingAmount = remainingAmount + monthlyAmount;
      }
      paidThisCycle = input.paidThisCycle;
    }

    const dueDay = input.dueDay ?? (Number(current.dueDate.replace(/\D/g, "")) || 15);
    const derived = computeLoanDerivedFields({
      monthlyAmount,
      remainingAmount,
      totalAmount,
      dueDay,
      category: input.category ?? current.category,
    });

    const [row] = await db
      .update(loans)
      .set({
        title: input.title ?? current.title,
        bank: input.bank ?? current.bank,
        category: input.category ?? current.category,
        monthlyAmount,
        remainingAmount,
        totalAmount,
        autoPay: input.autoPay ?? current.autoPay,
        paidThisCycle,
        paidInstallments,
        totalInstallments: derived.totalInstallments,
        progressPercent: derived.progressPercent,
        updatedAt: new Date(),
      })
      .where(and(eq(loans.id, loanId), eq(loans.userId, user.userId)))
      .returning();
    if (!row) {
      return fail("وام پیدا نشد", 404);
    }
    return ok(mapLoan(row));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request, { params }: IRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { loanId } = await params;
    const deleted = await getDb()
      .delete(loans)
      .where(and(eq(loans.id, loanId), eq(loans.userId, user.userId)))
      .returning({ id: loans.id });
    if (deleted.length === 0) {
      return fail("وام پیدا نشد", 404);
    }
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
