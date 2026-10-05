import { apiClient } from "@/lib/api";
import type { LoanDto } from "../types";
import type {
  CreateLoanRequest,
  UpdateLoanRequest,
} from "../validations/loan-schema";

export async function getLoans(): Promise<LoanDto[]> {
  const { data } = await apiClient.get<LoanDto[]>("/loans");
  return data;
}

export async function createLoan(input: CreateLoanRequest): Promise<LoanDto> {
  const { data } = await apiClient.post<LoanDto>("/loans", input);
  return data;
}

export async function updateLoan(
  loanId: string,
  input: UpdateLoanRequest,
): Promise<LoanDto> {
  const { data } = await apiClient.patch<LoanDto>(`/loans/${loanId}`, input);
  return data;
}

export async function deleteLoan(loanId: string): Promise<void> {
  await apiClient.delete(`/loans/${loanId}`);
}
