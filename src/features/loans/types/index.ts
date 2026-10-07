import type { LoanItem } from "@/types";
import type { CreateLoanRequest } from "../validations/loan-schema";
import type { UpdateLoanRequest } from "../validations/loan-schema";

/** وام کاربر جاری */
export type LoanDto = LoanItem;

export type { CreateLoanRequest, UpdateLoanRequest };
