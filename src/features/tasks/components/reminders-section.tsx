"use client";

import { useMemo, useState } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { AppIcon } from "@/components/ui/app-icon";
import {
  useCreateReminder,
  useDeleteReminder,
  useReminders,
  useUpdateReminder,
} from "../hooks/use-reminders";
import type { CreateReminderInput, Reminder, ReminderFilter } from "../types";
import {
  countRemindersByFilter,
  filterReminders,
  paginateReminders,
  REMINDERS_PAGE_SIZE,
  searchReminders,
  sortReminders,
} from "../utils/reminder-helpers";
import { ReminderCard } from "./reminder-card";
import { ReminderFilters } from "./reminder-filters";
import { ReminderFormDialog } from "./reminder-form-dialog";
import { ShowMoreButton } from "./show-more-button";

interface IProps {
  search: string;
}

export function RemindersSection({ search }: IProps) {
  const [period, setPeriod] = useState<ReminderFilter>("all");
  const [visibleCount, setVisibleCount] = useState(REMINDERS_PAGE_SIZE);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);

  const reminders = useReminders();
  const createReminder = useCreateReminder();
  const updateReminder = useUpdateReminder();
  const deleteReminder = useDeleteReminder();
  const confirm = useConfirm();

  const allReminders = useMemo(() => reminders.data ?? [], [reminders.data]);
  const counts = useMemo(
    () => countRemindersByFilter(allReminders),
    [allReminders],
  );
  const sorted = useMemo(
    () =>
      sortReminders(
        searchReminders(filterReminders(allReminders, period), search),
      ),
    [allReminders, period, search],
  );
  const visible = paginateReminders(sorted, visibleCount);
  const remainingCount = sorted.length - visible.length;

  function changePeriod(filter: ReminderFilter): void {
    setPeriod(filter);
    setVisibleCount(REMINDERS_PAGE_SIZE);
  }

  function openCreate(): void {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(reminder: Reminder): void {
    setEditing(reminder);
    setFormOpen(true);
  }

  function closeForm(): void {
    setFormOpen(false);
    setEditing(null);
  }

  function handleSubmit(input: CreateReminderInput): void {
    if (editing) {
      updateReminder.mutate(
        { reminderId: editing.id, input },
        { onSuccess: () => closeForm() },
      );
      return;
    }
    createReminder.mutate(input, { onSuccess: () => closeForm() });
  }

  function handleDelete(reminder: Reminder): void {
    void (async () => {
      const confirmed = await confirm({
        title: "حذف یادآور",
        message: `«${reminder.title}» برای همیشه حذف شود؟ این عمل قابل بازگشت نیست.`,
        confirmLabel: "حذف یادآور",
      });
      if (confirmed) {
        deleteReminder.mutate(reminder.id);
      }
    })();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <ReminderFilters active={period} counts={counts} onChange={changePeriod} />
      </div>

      {reminders.isPending ? <LoadingSkeleton rows={3} /> : null}
      {reminders.isError ? (
        <ErrorState
          message="بارگذاری یادآورها ناموفق بود"
          onRetry={() => reminders.refetch()}
        />
      ) : null}

      {reminders.data && sorted.length === 0 ? (
        <EmptyState
          icon="alarm"
          title={search ? "یادآوری مطابق جست‌وجو پیدا نشد" : "یادآوری در این بازه ندارید"}
          hint="با دکمه پایین صفحه اولین یادآور را بسازید"
        />
      ) : null}

      {visible.length > 0 ? (
        <div className="space-y-2.5">
          {visible.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              pending={updateReminder.isPending || deleteReminder.isPending}
              onToggle={(target) =>
                updateReminder.mutate({
                  reminderId: target.id,
                  input: { done: !target.done },
                })
              }
              onSnooze={(target, minutes) =>
                updateReminder.mutate({
                  reminderId: target.id,
                  input: { snoozeMinutes: minutes },
                })
              }
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : null}

      {remainingCount > 0 ? (
        <ShowMoreButton
          remaining={remainingCount}
          onClick={() => setVisibleCount((count) => count + REMINDERS_PAGE_SIZE)}
        />
      ) : null}

      {/* دکمه باید همیشه در دسترس باشد، حتی وقتی فهرست یادآورها طولانی است. */}
      <div className="sticky bottom-24 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-2 pb-2 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff] to-transparent">
        <button
          type="button"
          onClick={openCreate}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-[#4f46e5] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#4f46e5]/25 hover:bg-[#3525cd] active:scale-95 transition-all"
        >
          <AppIcon name="add" className="size-[20px] flex-shrink-0" />
          <span>یادآور جدید</span>
        </button>
      </div>

      <ReminderFormDialog
        open={formOpen}
        initial={editing}
        pending={createReminder.isPending || updateReminder.isPending}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
