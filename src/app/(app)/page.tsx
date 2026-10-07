import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard/views/dashboard-view";

export const metadata: Metadata = {
  title: "داشبورد | یادمان",
  description: "نمای کلی وضعیت خودرو، مالی و یادآورها",
};

export default function DashboardPage() {
  return <DashboardView />;
}
