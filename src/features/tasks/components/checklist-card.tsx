"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/app-icon";
import { faNum } from "@/lib/format";
import type { Checklist } from "../types";
import { getChecklistProgress } from "../utils/reminder-helpers";
import { ChecklistAddItemForm } from "./checklist-add-item-form";

interface IProps {
  checklist: Checklist;
  pending?: boolean;
  onToggleItem: (itemId: string, completed: boolean) => void;
  onAddItem: (text: string) => void;
}

export function ChecklistCard({
  checklist,
  pending = false,
  onToggleItem,
  onAddItem,
}: IProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { completedCount, totalCount, percent } =
    getChecklistProgress(checklist);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e2e8f0]/80 overflow-hidden">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsExpanded((value) => !value)}
          aria-expanded={isExpanded}
          className="flex items-center gap-3 cursor-pointer flex-1 text-right min-w-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd] flex-shrink-0">
            <AppIcon name={checklist.icon} className="size-[22px]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-[#0b1c30] truncate">
              {checklist.title}
            </h3>
            <p className="text-xs text-[#545f73] mt-0.5">
              {faNum(completedCount)} از {faNum(totalCount)} قلم ({faNum(percent)}٪)
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1.5">
          {checklist.active ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#006e4b] text-white">
              فعال
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setIsExpanded((value) => !value)}
            aria-label={isExpanded ? "بستن چک‌لیست" : "باز کردن چک‌لیست"}
            className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#545f73]"
          >
            <AppIcon
              name={isExpanded ? "expand_less" : "expand_more"}
              className="size-[20px]"
            />
          </button>
        </div>
      </div>

      <div
        className="w-full bg-[#e5eeff] h-2 rounded-full mt-3 overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`پیشرفت ${checklist.title}`}
      >
        <div
          className="bg-[#4f46e5] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {isExpanded ? (
        <div className="flex flex-col space-y-2 mt-3 pt-2 border-t border-[#f1f5f9]">
          {checklist.items.map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                item.completed ? "bg-[#eff4ff]" : "bg-white hover:bg-[#eff4ff]/60"
              }`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggleItem(item.id, !item.completed)}
                disabled={pending}
                aria-label={item.text}
                className="w-5 h-5 rounded accent-[#4f46e5] cursor-pointer"
              />
              <span
                className={`text-xs sm:text-sm flex-1 transition-all ${
                  item.completed
                    ? "line-through text-[#545f73]"
                    : "text-[#0b1c30] font-medium"
                }`}
              >
                {item.text}
              </span>
              <AppIcon
                name={item.completed ? "verified" : "radio_button_unchecked"}
                className={`size-[18px] ${
                  item.completed ? "text-[#006e4b]" : "text-[#c7c4d8]"
                }`}
              />
            </label>
          ))}

          <ChecklistAddItemForm disabled={pending} onAdd={onAddItem} />
        </div>
      ) : null}
    </div>
  );
}
