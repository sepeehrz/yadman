"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { LifeHubProvider } from "@/store/LifeHubContext";
import { getQueryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface IProps {
  children: ReactNode;
}

export default function Providers({ children }: IProps) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="life-hub-theme"
    >
      <QueryClientProvider client={queryClient}>
        {/* NotificationsProvider و DialogProvider عمداً اینجا نیستند: اعلان‌سنتر
            با کوئری‌های زنده سرویس‌های داخلی پنل را صدا می‌زند و نباید در صفحات
            عمومی (ورود/ثبت‌نام/بازیابی رمز) اجرا شود — داخل لایه‌ی (app) mount
            می‌شوند. LifeHubProvider فقط وضعیت UI (مودال و toast) است. */}
        <LifeHubProvider>{children}</LifeHubProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
