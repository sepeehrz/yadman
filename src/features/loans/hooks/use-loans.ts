import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { createLoan, deleteLoan, getLoans, updateLoan } from "../service";
import type { CreateLoanRequest, UpdateLoanRequest } from "../validations/loan-schema";

export const loanKeys = {
  all: ["loans"] as const,
  lists: () => [...loanKeys.all, "list"] as const,
};

export function useLoans() {
  return useQuery({
    queryKey: loanKeys.lists(),
    queryFn: getLoans,
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLoanRequest) => createLoan(input),
    onSuccess: (loan) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      toast.success(`وام «${loan.title}» اضافه شد`);
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "افزودن وام ناموفق بود"));
    },
  });
}

export function useUpdateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      loanId,
      input,
    }: {
      loanId: string;
      input: UpdateLoanRequest;
    }) => updateLoan(loanId, input),
    onSuccess: (loan, variables) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      if (variables.input.paidThisCycle === true) {
        toast.success(`پرداخت «${loan.title}» ثبت شد! 🎉`);
      } else if (variables.input.paidThisCycle === false) {
        toast.info(`«${loan.title}» به حالت در انتظار برگشت`);
      } else {
        toast.success("وام به‌روزرسانی شد");
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "به‌روزرسانی وام ناموفق بود"));
    },
  });
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanId: string) => deleteLoan(loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      toast.success("وام حذف شد");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "حذف وام ناموفق بود"));
    },
  });
}
