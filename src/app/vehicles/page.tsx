import type { Metadata } from "next";
import { VehiclesScreen } from "@/features/vehicles/components/VehiclesScreen";

export const metadata: Metadata = {
  title: "خودروها | لایف‌هاب",
  description: "ردیاب‌های نگهداری خودرو و دفترچه سرویس",
};

export default function VehiclesPage() {
  return <VehiclesScreen />;
}
