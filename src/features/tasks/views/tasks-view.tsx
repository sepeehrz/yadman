"use client";

import { AppIcon } from "@/components/ui/app-icon";
import { faNum } from "@/lib/format";
import { useTasksView } from "../hooks/use-tasks-view";
import { ChecklistsSection } from "../components/checklists-section";
import { RemindersSection } from "../components/reminders-section";

export function TasksView() {
  const model = useTasksView();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-1 pb-28 space-y-4">
      <div className="pt-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-[11px] text-primary font-bold">
              بهره‌وری و لجستیک
            </span>
            <h1 className="text-2xl sm:text-[26px] font-bold text-foreground tracking-tight">
              کارها و لیست‌ها
            </h1>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-foreground">
            {faNum(model.activeCount)} فعال
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 flex items-center h-12 bg-card rounded-xl px-3.5 shadow-xs border border-border/80">
            <AppIcon name="search" className="text-muted-foreground size-[20px] ml-2" />
            <input
              type="text"
              value={model.search}
              onChange={(event) => model.setSearch(event.target.value)}
              placeholder="جست‌وجوی یادآورها، اقلام، چک‌لیست‌ها..."
              aria-label="جست‌وجو"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
            />
            {model.search ? (
              <button
                type="button"
                onClick={() => model.setSearch("")}
                aria-label="پاک کردن جست‌وجو"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="p-1 bg-primary/10 rounded-xl grid grid-cols-2">
        <button
          type="button"
          onClick={() => model.setMainTab("reminders")}
          aria-pressed={model.showReminders}
          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 ${
            model.showReminders
              ? "bg-card text-primary shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>یادآورها</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              model.showReminders
                ? "bg-primary/15 text-primary font-bold"
                : "bg-primary/10 text-muted-foreground"
            }`}
          >
            {faNum(model.remindersCount)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => model.setMainTab("checklists")}
          aria-pressed={!model.showReminders}
          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 ${
            !model.showReminders
              ? "bg-card text-primary shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>چک‌لیست‌ها</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              !model.showReminders
                ? "bg-primary/15 text-primary font-bold"
                : "bg-primary/10 text-muted-foreground"
            }`}
          >
            {faNum(model.checklistsCount)}
          </span>
        </button>
      </div>

      {model.showReminders ? (
        <RemindersSection search={model.search} />
      ) : (
        <ChecklistsSection search={model.search} />
      )}
    </div>
  );
}
