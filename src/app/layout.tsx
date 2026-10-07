import { cn } from "@/lib";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/providers";
import { vazirmatn } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "یادمان | مدیر لجستیک شخصی",
  description:
    "مدیر لجستیک شخصی آرام و قابل‌اعتماد: خودرو، وام و اقساط، یادآورهای هوشمند و چک‌لیست‌های آماده.",
  appleWebApp: {
    capable: true,
    title: "یادمان",
    statusBarStyle: "default",
  },
  icons: {
    // آیکون لمسی سافاری برای iOS (بعداً در public/icons/ اضافه می‌شود)
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground antialiased selection:bg-primary/15 selection:text-primary",
          vazirmatn.className,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
