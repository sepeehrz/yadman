import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@/components/common/toast";
import { isApiError } from "@/lib/api";
import {
  createChecklist,
  createChecklistItem,
  deleteChecklist,
  deleteChecklistItem,
  getChecklists,
  updateChecklistItem,
} from "../service";
import type {
  Checklist,
  CreateChecklistInput,
  CreateChecklistItemInput,
  UpdateChecklistItemInput,
} from "../types";
import { checklistKeys } from "./task-query-keys";

function toMessage(error: unknown, fallback: string): string {
  return isApiError(error) && error.message ? error.message : fallback;
}

export function useChecklists() {
  return useQuery({
    queryKey: checklistKeys.lists(),
    queryFn: getChecklists,
  });
}

export function useCreateChecklist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateChecklistInput) => createChecklist(input),
    onSuccess: (checklist) => {
      queryClient.invalidateQueries({ queryKey: checklistKeys.lists() });
      toast.success(`چک‌لیست «${checklist.title}» ساخته شد`);
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "ساخت چک‌لیست ناموفق بود"));
    },
  });
}

export function useCreateChecklistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      checklistId,
      input,
    }: {
      checklistId: string;
      input: CreateChecklistItemInput;
    }) => createChecklistItem(checklistId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: checklistKeys.lists(),
      });
      toast.success("قلم جدید به چک‌لیست اضافه شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "افزودن قلم ناموفق بود"));
    },
  });
}

/**
 * تغییر وضعیت قلم به‌صورت Optimistic انجام می‌شود تا درصد پیشرفت
 * بدون انتظار برای پاسخ سرور، زنده به‌روزرسانی شود.
 */
export function useUpdateChecklistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      checklistId,
      itemId,
      input,
    }: {
      checklistId: string;
      itemId: string;
      input: UpdateChecklistItemInput;
    }) => updateChecklistItem(checklistId, itemId, input),
    onMutate: async ({ checklistId, itemId, input }) => {
      await queryClient.cancelQueries({ queryKey: checklistKeys.lists() });
      const previous = queryClient.getQueryData<Checklist[]>(
        checklistKeys.lists(),
      );
      queryClient.setQueryData<Checklist[]>(checklistKeys.lists(), (current) =>
        current?.map((checklist) =>
          checklist.id === checklistId
            ? {
                ...checklist,
                items: checklist.items.map((item) =>
                  item.id === itemId
                    ? { ...item, completed: input.completed }
                    : item,
                ),
              }
            : checklist,
        ),
      );
      return { previous };
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(checklistKeys.lists(), context.previous);
      }
      toast.error(toMessage(error, "تغییر وضعیت قلم ناموفق بود"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: checklistKeys.lists() });
    },
  });
}

/**
 * حذف قلم به‌صورت Optimistic انجام می‌شود تا فهرست بلافاصله کوتاه شود
 * و در صورت خطای سرور به وضعیت قبلی بازگردد.
 */
export function useDeleteChecklistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      checklistId,
      itemId,
    }: {
      checklistId: string;
      itemId: string;
    }) => deleteChecklistItem(checklistId, itemId),
    onMutate: async ({ checklistId, itemId }) => {
      await queryClient.cancelQueries({ queryKey: checklistKeys.lists() });
      const previous = queryClient.getQueryData<Checklist[]>(
        checklistKeys.lists(),
      );
      queryClient.setQueryData<Checklist[]>(checklistKeys.lists(), (current) =>
        current?.map((checklist) =>
          checklist.id === checklistId
            ? {
                ...checklist,
                items: checklist.items.filter((item) => item.id !== itemId),
              }
            : checklist,
        ),
      );
      return { previous };
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(checklistKeys.lists(), context.previous);
      }
      toast.error(toMessage(error, "حذف قلم ناموفق بود"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: checklistKeys.lists() });
    },
  });
}

/** حذف کل چک‌لیست به‌همراه همه اقلام آن */
export function useDeleteChecklist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (checklistId: string) => deleteChecklist(checklistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checklistKeys.lists() });
      toast.success("چک‌لیست حذف شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "حذف چک‌لیست ناموفق بود"));
    },
  });
}
