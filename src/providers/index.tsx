"use client";

import { ReactNode } from "react";
import { DialogProvider } from "./dialog-provider";
import { ThemeProvider } from "./theme-provider";
import { LifeHubProvider } from "@/store/LifeHubContext";
import { NotificationsProvider } from "@/features/notifications/providers/notifications-provider";
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
        {/* NotificationsProvider باید بیرون از DialogProvider باشد، چون
            DialogProvider بدنه‌ی دیالوگ را کنار children رندر می‌کند و اعلان‌سنتر
            به context اعلان‌ها نیاز دارد */}
        <NotificationsProvider>
          <DialogProvider>
            <LifeHubProvider>{children}</LifeHubProvider>
          </DialogProvider>
        </NotificationsProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
