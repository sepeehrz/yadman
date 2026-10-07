import type { MetadataRoute } from "next";

const APP_NAME = "لایف‌هاب | مدیر لجستیک شخصی";
const SHORT_NAME = "لایف‌هاب";
const DESCRIPTION =
  "مدیر لجستیک شخصی آرام و قابل‌اعتماد: خودرو، وام و اقساط، یادآورهای هوشمند و چک‌لیست‌های آماده.";

/**
 * مانیفست PWA بر اساس مستندات Next.js (app/manifest.ts).
 * این فایل در مسیر /manifest.webmanifest سرو می‌شود و
 * لینک <link rel="manifest"> به‌صورت خودکار به head اضافه می‌شود.
 *
 * آیکون‌ها باید بعداً به‌صورت دستی در public/icons/ قرار بگیرند.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: APP_NAME,
    short_name: SHORT_NAME,
    description: DESCRIPTION,
    lang: "fa",
    dir: "rtl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#f8fafc",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
