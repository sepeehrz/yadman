import type { Metadata } from "next";
import { LoansView } from "@/features/loans/views/loans-view";

export const metadata: Metadata = {
  title: "وام‌ها و اقساط | یادمان",
  description: "مدیریت وام‌ها، اقساط و بازپرداخت‌ها",
};

export default function LoansPage() {
  return <LoansView />;
}
