import { Suspense } from "react";
import type { Metadata } from "next";
import { VehiclesView } from "@/features/vehicles/views/vehicles-view";

export const metadata: Metadata = {
  title: "خودروها و سرویس‌ها | یادمان",
  description: "مدیریت خودروها، سرویس‌های دوره‌ای، بیمه‌نامه‌ها و عوارض",
};

export default function VehiclesPage() {
  return (
    <Suspense fallback={null}>
      <VehiclesView />
    </Suspense>
  );
}
