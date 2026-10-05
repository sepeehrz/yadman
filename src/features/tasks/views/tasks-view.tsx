"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/app-icon";
import { faNum } from "@/lib/format";
import { useChecklists } from "../hooks/use-checklists";
import { useReminders } from "../hooks/use-reminders";
import { ChecklistsSection } from "../components/checklists-section";
import { RemindersSection } from "../components/reminders-section";

type MainTab = "reminders" | "checklists";

export function TasksView() {
  const [mainTab, setMainTab] = useState<MainTab>("reminders");
  const [search, setSearch] = useState("");

  const reminders = useReminders();
  const checklists = useChecklists();

  const remindersCount = (reminders.data ?? []).length;
  const checklistsCount = (checklists.data ?? []).length;
  const activeCount = (reminders.data ?? []).filter(
    (reminder) => !reminder.done,
  ).length;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-28 space-y-4">
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
            {faNum(activeCount)} فعال
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 flex items-center h-12 bg-card rounded-xl px-3.5 shadow-xs border border-border/80">
            <AppIcon name="search" className="text-muted-foreground size-[20px] ml-2" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جست‌وجوی یادآورها، اقلام، چک‌لیست‌ها..."
              aria-label="جست‌وجو"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
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
          onClick={() => setMainTab("reminders")}
          aria-pressed={mainTab === "reminders"}
          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 ${
            mainTab === "reminders"
              ? "bg-card text-primary shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>یادآورها</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              mainTab === "reminders"
                ? "bg-primary/15 text-primary font-bold"
                : "bg-primary/10 text-muted-foreground"
            }`}
          >
            {faNum(remindersCount)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMainTab("checklists")}
          aria-pressed={mainTab === "checklists"}
          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 ${
            mainTab === "checklists"
              ? "bg-card text-primary shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>چک‌لیست‌ها</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              mainTab === "checklists"
                ? "bg-primary/15 text-primary font-bold"
                : "bg-primary/10 text-muted-foreground"
            }`}
          >
            {faNum(checklistsCount)}
          </span>
        </button>
      </div>

      {mainTab === "reminders" ? (
        <RemindersSection search={search} />
      ) : (
        <ChecklistsSection search={search} />
      )}
    </div>
  );
}
