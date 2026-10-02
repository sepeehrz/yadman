import type { Metadata } from "next";
import { DashboardScreen } from "@/features/dashboard/components/DashboardScreen";

export const metadata: Metadata = {
  title: "داشبورد | لایف‌هاب",
  description: "نمای کلی وضعیت خودرو، مالی و یادآورها",
};

export default function DashboardPage() {
  return <DashboardScreen />;
}
