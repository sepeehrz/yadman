import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/common/toast";
import { isApiError } from "@/lib/api";
import {
  createReminder,
  deleteReminder,
  getReminders,
  updateReminder,
} from "../service";
import type { CreateReminderInput, UpdateReminderInput } from "../types";
import { reminderKeys } from "./task-query-keys";

function toMessage(error: unknown, fallback: string): string {
  return isApiError(error) && error.message ? error.message : fallback;
}

export function useReminders() {
  return useQuery({
    queryKey: reminderKeys.lists(),
    queryFn: getReminders,
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReminderInput) => createReminder(input),
    onSuccess: (reminder) => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
      toast.success(`یادآور «${reminder.title}» ساخته شد`);
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "ساخت یادآور ناموفق بود"));
    },
  });
}

export function useUpdateReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reminderId,
      input,
    }: {
      reminderId: string;
      input: UpdateReminderInput;
    }) => updateReminder(reminderId, input),
    onSuccess: (reminder, variables) => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
      if (variables.input.done === true) {
        toast.success(`تمام شد: «${reminder.title}» 🎉`);
      } else if (variables.input.snoozeMinutes) {
        toast.info(`یادآور «${reminder.title}» به تعویق افتاد`);
      } else {
        toast.success("یادآور به‌روزرسانی شد");
      }
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "به‌روزرسانی یادآور ناموفق بود"));
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reminderId: string) => deleteReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.lists() });
      toast.success("یادآور حذف شد");
    },
    onError: (error: unknown) => {
      toast.error(toMessage(error, "حذف یادآور ناموفق بود"));
    },
  });
}
