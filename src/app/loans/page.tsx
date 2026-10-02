import type { Metadata } from "next";
import { LoansScreen } from "@/features/loans/components/LoansScreen";

export const metadata: Metadata = {
  title: "وام‌ها و اقساط | لایف‌هاب",
  description: "مدیریت وام‌ها، اقساط و بازپرداخت‌ها",
};

export default function LoansPage() {
  return <LoansScreen />;
}
