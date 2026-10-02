import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f8f9ff] text-[#0b1c30] antialiased selection:bg-[#4f46e5]/15 selection:text-[#3525cd]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
