"use client";

import { useState } from "react";
import { useChecklists } from "./use-checklists";
import { useReminders } from "./use-reminders";

export type TasksMainTab = "reminders" | "checklists";

/** مدل ویوی کارها — وضعیت تب/جست‌وجو و شمارش‌ها؛ ویو فقط رندر می‌کند */
export function useTasksView() {
  const [mainTab, setMainTab] = useState<TasksMainTab>("reminders");
  const [search, setSearch] = useState("");

  const reminders = useReminders();
  const checklists = useChecklists();

  const remindersCount = (reminders.data ?? []).length;
  const checklistsCount = (checklists.data ?? []).length;
  const activeCount = (reminders.data ?? []).filter(
    (reminder) => !reminder.done,
  ).length;

  return {
    mainTab,
    setMainTab,
    search,
    setSearch,
    showReminders: mainTab === "reminders",
    remindersCount,
    checklistsCount,
    activeCount,
  };
}
