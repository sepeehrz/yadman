import type { Metadata } from "next";
import { TasksView } from "@/features/tasks/views/tasks-view";

export const metadata: Metadata = {
  title: "کارها و لیست‌ها | یادمان",
  description: "یادآورها و چک‌لیست‌های متصل به سرویس",
};

export default function TasksPage() {
  return <TasksView />;
}
