"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { DialogProvider } from "./dialog-provider";
import { LifeHubProvider } from "@/store/LifeHubContext";
import { getQueryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const ThemeProvider = dynamic(
  () => import("./theme-provider").then((mod) => mod.ThemeProvider),
  { ssr: false },
);

interface IProps {
  children: ReactNode;
}

export default function Providers({ children }: IProps) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <DialogProvider>
          <LifeHubProvider>{children}</LifeHubProvider>
        </DialogProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
