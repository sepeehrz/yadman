# لایف‌هاب (LifeHub) — نسخه Next.js

مدیر لجستیک شخصی فارسی و راست‌چین: خودرو، وام و اقساط، یادآورهای هوشمند و چک‌لیست‌های آماده.

مهاجرت‌شده از React + Vite به **Next.js 15 (App Router)** با معماری **Feature-Based**.

## ساختار پروژه

```
src/
├── app/                          # روت‌های App Router (سرور کامپوننت)
│   ├── layout.tsx                # لی‌اوت ریشه (fa + dir=rtl + فونت وزیرمتن)
│   ├── page.tsx                  # داشبورد (/)
│   ├── vehicles/page.tsx         # خودروها
│   ├── loans/page.tsx            # وام‌ها و اقساط
│   ├── tasks/page.tsx            # کارها و لیست‌ها
│   ├── providers.tsx             # پرووایدر کلاینت (استور + شل)
│   └── globals.css               # استایل سراسری (Tailwind v4)
├── features/                     # فیچرها — هر فیچر مستقل
│   ├── dashboard/components/     # صفحه داشبورد
│   ├── vehicles/components/      # صفحه خودرو
│   ├── loans/components/         # صفحه وام‌ها
│   └── tasks/components/         # صفحه کارها
├── components/
│   ├── layout/                   # شل اپ: Header، NavigationDock، AppShell
│   ├── modals/                   # مودال‌های سراسری (جست‌وجو، اعلان، پروفایل، ...)
│   └── ui/                       # اجزای خرد (Toast)
├── store/
│   └── LifeHubContext.tsx        # استیت سراسری (Context + Hooks + localStorage)
└── lib/
    ├── types.ts                  # تایپ‌های دامنه
    ├── mock-data.ts              # داده اولیه فارسی
    └── format.ts                 # هلپر اعداد فارسی / دلار
```

## اجرا

**پیش‌نیاز:** Node.js 20+

```bash
npm install
npm run dev      # سرور توسعه
npm run build    # بیلد پروداکشن
npm start        # اجرای پروداکشن
npm run lint     # تایپ‌چک
```

## نکات معماری

- صفحه‌ها (`app/*/page.tsx`) **سرور کامپوننت** هستند و فقط اسکرین فیچر را رندر می‌کنند.
- اسکرین‌ها (`features/*/components`) **کلاینت کامپوننت**‌اند و دیتا را مستقیم از `useLifeHub()` می‌خوانند (بدون prop-drilling).
- ناوبری با `next/link` + `usePathname` انجام می‌شود؛ تب فعال از روی URL مشخص می‌شود.
- وضعیت سراسری (کیلومتر، ردیاب‌ها، وام‌ها، کارها، چک‌لیست‌ها، مودال‌ها، تost) در `LifeHubProvider` با `localStorage` ماندگار می‌شود.
