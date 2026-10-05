"use client";

import type { ReactNode } from "react";
import { ASSETS } from "@/lib/mock-data";

interface IProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** پوسته مشترک صفحات احراز هویت — کارت مرکزی با هویت بصری لایف‌هاب */
export function AuthShell({ title, subtitle, children, footer }: IProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-chart-4/15 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2">
          <img
            src={ASSETS.logo}
            alt="آیکون لایف‌هاب"
            className="h-14 w-14 rounded-2xl object-contain shadow-md"
          />
          <span className="text-xl font-bold tracking-tight text-foreground">
            لایف‌هاب
          </span>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-lg sm:p-8">
          <div className="mb-6 space-y-1 text-center">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>

        {footer && <div className="mt-4 text-center">{footer}</div>}
      </div>
    </div>
  );
}
