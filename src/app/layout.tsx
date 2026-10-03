import { cn } from "@/lib";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";
import { AppShell } from "@/components/layout/AppShell";
import { vazirmatn } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "لایف‌هاب | مدیر لجستیک شخصی",
  description:
    "مدیر لجستیک شخصی آرام و قابل‌اعتماد: خودرو، وام و اقساط، یادآورهای هوشمند و چک‌لیست‌های آماده.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body
        className={cn(
          "bg-[#f8f9ff] text-[#0b1c30] antialiased selection:bg-[#4f46e5]/15 selection:text-[#3525cd]",
          vazirmatn.className,
        )}
      >
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
