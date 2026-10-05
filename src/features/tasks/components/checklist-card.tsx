"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/app-icon";
import { faNum } from "@/lib/format";
import type { Checklist, ChecklistItem } from "../types";
import { getChecklistProgress } from "../utils/reminder-helpers";
import { ChecklistAddItemForm } from "./checklist-add-item-form";

interface IProps {
  checklist: Checklist;
  pending?: boolean;
  onToggleItem: (itemId: string, completed: boolean) => void;
  onAddItem: (text: string) => void;
  onDeleteItem: (item: ChecklistItem) => void;
  onDeleteChecklist: () => void;
}

export function ChecklistCard({
  checklist,
  pending = false,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onDeleteChecklist,
}: IProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { completedCount, totalCount, percent } =
    getChecklistProgress(checklist);

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-5 shadow-xs border border-border/80">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsExpanded((value) => !value)}
          aria-expanded={isExpanded}
          className="flex items-center gap-3 cursor-pointer flex-1 text-right min-w-0"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary flex-shrink-0">
            <AppIcon name={checklist.icon} className="size-[22px]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
              {checklist.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {faNum(completedCount)} از {faNum(totalCount)} قلم ({faNum(percent)}٪)
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {checklist.active ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success text-success-foreground">
              فعال
            </span>
          ) : null}
          <button
            type="button"
            onClick={onDeleteChecklist}
            disabled={pending}
            aria-label={`حذف چک‌لیست ${checklist.title}`}
            title="حذف چک‌لیست"
            className="w-8 h-8 rounded-lg bg-destructive/50 text-destructive flex items-center justify-center hover:bg-destructive/15 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <AppIcon name="delete" className="size-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded((value) => !value)}
            aria-label={isExpanded ? "بستن چک‌لیست" : "باز کردن چک‌لیست"}
            className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-muted-foreground"
          >
            <AppIcon
              name={isExpanded ? "expand_less" : "expand_more"}
              className="size-[20px]"
            />
          </button>
        </div>
      </div>

      <div
        className="w-full bg-primary/10 h-2 rounded-full mt-3 overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`پیشرفت ${checklist.title}`}
      >
        <div
          className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {isExpanded ? (
        <div className="flex flex-col space-y-2 mt-3 pt-2 border-t border-border">
          {checklist.items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-1 rounded-xl pr-1 transition-colors ${
                item.completed ? "bg-primary/5" : "bg-card"
              }`}
            >
              {/* برچسب فقط بخش چک‌باکس و متن را می‌پوشاند تا کلیک روی
                  دکمه حذف، وضعیت قلم را تغییر ندهد. */}
              <label
                className={`flex flex-1 items-center gap-3 p-2.5 cursor-pointer rounded-xl transition-colors ${
                  item.completed ? "" : "hover:bg-primary/5"
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onToggleItem(item.id, !item.completed)}
                  disabled={pending}
                  aria-label={item.text}
                  className="w-5 h-5 rounded accent-primary cursor-pointer flex-shrink-0"
                />
                <span
                  className={`text-xs sm:text-sm flex-1 transition-all ${
                    item.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground font-medium"
                  }`}
                >
                  {item.text}
                </span>
                <AppIcon
                  name={item.completed ? "verified" : "radio_button_unchecked"}
                  className={`size-[18px] flex-shrink-0 ${
                    item.completed ? "text-success" : "text-muted-foreground/60"
                  }`}
                />
              </label>
              <button
                type="button"
                onClick={() => onDeleteItem(item)}
                disabled={pending}
                aria-label={`حذف قلم ${item.text}`}
                title="حذف قلم"
                className="w-8 h-8 rounded-lg bg-destructive/50 text-destructive flex items-center justify-center hover:bg-destructive/15 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex-shrink-0"
              >
                <AppIcon name="delete" className="size-[16px]" />
              </button>
            </div>
          ))}

          <ChecklistAddItemForm disabled={pending} onAdd={onAddItem} />
        </div>
      ) : null}
    </div>
  );
}