"use client";

import { useMemo, useState } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { AppIcon } from "@/components/ui/app-icon";
import {
  useChecklists,
  useCreateChecklist,
  useCreateChecklistItem,
  useDeleteChecklist,
  useDeleteChecklistItem,
  useUpdateChecklistItem,
} from "../hooks/use-checklists";
import type { ChecklistItem, CreateChecklistInput } from "../types";
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
  const deleteItem = useDeleteChecklistItem();
  const deleteChecklist = useDeleteChecklist();
  const confirm = useConfirm();

  const list = useMemo(
    () => filterChecklists(checklists.data ?? [], search),
    [checklists.data, search],
  );
  const visible = list.slice(0, visibleCount);
  const remainingCount = list.length - visible.length;

  function handleSubmit(input: CreateChecklistInput): void {
    createChecklist.mutate(input, { onSuccess: () => setCreateOpen(false) });
  }

  function handleDeleteItem(
    checklistId: string,
    item: ChecklistItem,
  ): void {
    void (async () => {
      const confirmed = await confirm({
        title: "حذف قلم",
        message: `«${item.text}» از این چک‌لیست حذف شود؟`,
        confirmLabel: "حذف قلم",
      });
      if (confirmed) {
        deleteItem.mutate({ checklistId, itemId: item.id });
      }
    })();
  }

  function handleDeleteChecklist(checklistId: string, title: string): void {
    void (async () => {
      const confirmed = await confirm({
        title: "حذف چک‌لیست",
        message: `«${title}» و همه اقلام آن برای همیشه حذف شود؟ این عمل قابل بازگشت نیست.`,
        confirmLabel: "حذف چک‌لیست",
      });
      if (confirmed) {
        deleteChecklist.mutate(checklistId);
      }
    })();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            چک‌لیست‌های من
          </h2>
          <p className="text-xs text-muted-foreground">
            پیشرفت هر چک‌لیست به‌صورت زنده محاسبه می‌شود
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex flex-shrink-0 items-center gap-1.5 h-9 px-3.5 rounded-full bg-primary text-primary-foreground text-xs font-bold whitespace-nowrap shadow-[0_6px_16px_var(--primary)]/25 hover:bg-primary active:scale-95 transition-all"
        >
          <AppIcon name="add" className="size-[16px] flex-shrink-0" />
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
          pending={
            toggleItem.isPending ||
            addItem.isPending ||
            deleteItem.isPending ||
            deleteChecklist.isPending
          }
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
          onDeleteItem={(item) =>
            handleDeleteItem(checklist.id, item)
          }
          onDeleteChecklist={() =>
            handleDeleteChecklist(checklist.id, checklist.title)
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
