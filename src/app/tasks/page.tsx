import type { Metadata } from "next";
import { TasksScreen } from "@/features/tasks/components/TasksScreen";

export const metadata: Metadata = {
  title: "کارها و لیست‌ها | لایف‌هاب",
  description: "یادآورها و چک‌لیست‌های آماده",
};

export default function TasksPage() {
  return <TasksScreen />;
}
