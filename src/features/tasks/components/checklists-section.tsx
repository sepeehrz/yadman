"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { AppIcon } from "@/components/ui/app-icon";
import {
  useChecklists,
  useCreateChecklist,
  useCreateChecklistItem,
  useUpdateChecklistItem,
} from "../hooks/use-checklists";
import type { CreateChecklistInput } from "../types";
import {
  filterChecklists,
  REMINDERS_PAGE_SIZE,
} from "../utils/reminder-helpers";
import { ChecklistCard } from "./checklist-card";
import { ChecklistFormDialog } from "./checklist-form-dialog";
import { ShowMoreButton } from "./show-more-button";

interface IProps {
  search: string;
}

export function ChecklistsSection({ search }: IProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(REMINDERS_PAGE_SIZE);

  const checklists = useChecklists();
  const createChecklist = useCreateChecklist();
  const addItem = useCreateChecklistItem();
  const toggleItem = useUpdateChecklistItem();

  const list = useMemo(
    () => filterChecklists(checklists.data ?? [], search),
    [checklists.data, search],
  );
  const visible = list.slice(0, visibleCount);
  const remainingCount = list.length - visible.length;

  function handleSubmit(input: CreateChecklistInput): void {
    createChecklist.mutate(input, { onSuccess: () => setCreateOpen(false) });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#0b1c30]">
            چک‌لیست‌های من
          </h2>
          <p className="text-xs text-[#545f73]">
            پیشرفت هر چک‌لیست به‌صورت زنده محاسبه می‌شود
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1 text-xs text-[#3525cd] font-bold py-1.5 px-3 rounded-lg hover:bg-[#eff4ff] active:scale-95 transition-all"
        >
          <AppIcon name="add" className="size-[16px]" />
          <span>چک‌لیست جدید</span>
        </button>
      </div>

      {checklists.isPending ? <LoadingSkeleton rows={3} /> : null}
      {checklists.isError ? (
        <ErrorState
          message="بارگذاری چک‌لیست‌ها ناموفق بود"
          onRetry={() => checklists.refetch()}
        />
      ) : null}

      {checklists.data && visible.length === 0 ? (
        <EmptyState
          icon="checklist"
          title={search ? "چک‌لیست مطابق جست‌وجو پیدا نشد" : "هنوز چک‌لیستی نساخته‌اید"}
          hint="اولین چک‌لیست را با نام و آیتم‌هایش بسازید"
        />
      ) : null}

      {visible.map((checklist) => (
        <ChecklistCard
          key={checklist.id}
          checklist={checklist}
          pending={toggleItem.isPending || addItem.isPending}
          onToggleItem={(itemId, completed) =>
            toggleItem.mutate({
              checklistId: checklist.id,
              itemId,
              input: { completed },
            })
          }
          onAddItem={(text) =>
            addItem.mutate({ checklistId: checklist.id, input: { text } })
          }
        />
      ))}

      {remainingCount > 0 ? (
        <ShowMoreButton
          remaining={remainingCount}
          onClick={() => setVisibleCount((count) => count + REMINDERS_PAGE_SIZE)}
        />
      ) : null}

      <ChecklistFormDialog
        open={createOpen}
        pending={createChecklist.isPending}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
