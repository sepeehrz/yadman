"use client";

import { faNum } from "@/lib/format";
import type { ReminderFilter } from "../types";
import { PERIOD_LABEL } from "../utils/reminder-helpers";

interface IProps {
  active: ReminderFilter;
  counts: Record<ReminderFilter, number>;
  onChange: (filter: ReminderFilter) => void;
}

const FILTERS: ReminderFilter[] = ["all", "today", "week", "month", "year"];

export function ReminderFilters({ active, counts, onChange }: IProps) {
  return (
    <div
      className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
      role="tablist"
      aria-label="فیلتر زمانی یادآورها"
    >
      {FILTERS.map((filter) => {
        const isActive = active === filter;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "bg-primary/5 text-muted-foreground hover:bg-primary/10"
            }`}
          >
            <span>{PERIOD_LABEL[filter]}</span>
            <span
              className={`text-[10px] px-1.5 rounded-full font-bold ${
                isActive
                  ? "bg-primary-foreground/25 text-primary-foreground"
                  : "bg-primary/10 text-muted-foreground"
              }`}
            >
              {faNum(counts[filter])}
            </span>
          </button>
        );
      })}
    </div>
  );
}
