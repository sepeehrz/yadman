import { desc, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { loans } from "@/database/schema/finance";
import { createLoanSchema } from "@/features/loans/validations/loan-schema";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/utils/server-helpers/route-helpers";
import { computeLoanDerivedFields, mapLoan } from "@/utils/server-helpers/loans-helpers";

export async function GET(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const rows = await getDb()
      .select()
      .from(loans)
      .where(eq(loans.userId, user.userId))
      .orderBy(desc(loans.createdAt));
    return ok(rows.map(mapLoan));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const body: unknown = await request.json();
    const parsed = createLoanSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات وام معتبر نیست", 422);
    }
    const input = parsed.data;
    const totalAmount = input.totalAmount ?? input.remainingAmount;
    const derived = computeLoanDerivedFields({
      monthlyAmount: input.monthlyAmount,
      remainingAmount: input.remainingAmount,
      totalAmount,
      dueDay: input.dueDay,
      category: input.category,
    });
    const [row] = await getDb()
      .insert(loans)
      .values({
        id: crypto.randomUUID(),
        userId: user.userId,
        title: input.title,
        bank: input.bank,
        icon: derived.icon,
        dueNotice: derived.dueNotice,
        dueDate: derived.dueDate,
        monthlyAmount: input.monthlyAmount,
        remainingAmount: input.remainingAmount,
        totalAmount,
        paidInstallments: 0,
        totalInstallments: derived.totalInstallments,
        progressPercent: derived.progressPercent,
        autoPay: input.autoPay,
        category: input.category,
        paidThisCycle: false,
      })
      .returning();
    return ok(mapLoan(row), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
