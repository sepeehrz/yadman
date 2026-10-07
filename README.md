# یادمان (Yadman) — نسخه Next.js

مدیر لجستیک شخصی فارسی و راست‌چین: خودرو، وام و اقساط، یادآورهای هوشمند و چک‌لیست‌های آماده.

مهاجرت‌شده از React + Vite به **Next.js 15 (App Router)** با معماری **Feature-Based**.

## ساختار پروژه

```
src/
├── app/                          # روت‌های App Router
│   ├── (app)/                    # صفحات داخلی (کنترل لاگین در middleware)
│   │   ├── page.tsx              # داشبورد (/)
│   │   ├── vehicles/page.tsx     # خودروها
│   │   ├── loans/page.tsx        # وام‌ها و اقساط
│   │   └── tasks/page.tsx        # کارها و لیست‌ها
│   ├── (auth)/                   # ورود، ثبت‌نام، بازیابی رمز
│   ├── api/                      # روت‌های API داخلی (پراکسی به بک‌اند)
│   ├── layout.tsx                # لی‌اوت ریشه (fa + dir=rtl + فونت وزیرمتن)
│   └── globals.css               # استایل سراسری (Tailwind v4)
├── features/                     # فیچرها — هر فیچر مستقل و خودکفا
│   └── <feature>/
│       ├── components/           # کامپوننت‌های UI فیچر
│       ├── hooks/                # هوک‌های داده (React Query) + view-model
│       ├── service/              # لایه سرویس — تعریف endpoint ها و درخواست‌ها
│       ├── types/                # تایپ‌های فیچر
│       ├── utils/                # هلپرهای داخل فیچر
│       ├── validations/          # اسکیماهای Zod
│       └── views/                # ویوی اصلی فیچر (ورودی از app)
├── components/
│   ├── common/                   # کامپوننت‌های مشترک بیزینسی
│   ├── layout/                   # شل اپ: Header، NavigationDock، AppShell
│   └── ui/                       # اجزای خرد دیزاین‌سیستم
├── lib/                          # پیکربندی کتابخانه‌ها (axios client، auth، format)
├── hooks/                        # هوک‌های سراسری (use-dialog، use-confirm)
├── providers/                    # پرووایدرهای سراسری (theme، query، dialog)
├── types/
│   └── server-types/             # تایپ‌های سمت سرور (به ازای هر اندپوینت)
├── utils/
│   ├── filters/                  # فیلتر/فرمت سراسری
│   └── server-helpers/           # هلپرهای سمت سرور (به ازای هر اندپوینت)
└── database/                     # اسکیمای Drizzle و اتصال دیتابیس
```

## اجرا

**پیش‌نیاز:** Node.js 20+

```bash
npm install
npm run dev      # سرور توسعه
npm run build    # بیلد پروداکشن
npm start        # اجرای پروداکشن
npm run lint     # تایپ‌چک
npm run test     # تست‌ها (vitest)
```

## نکات معماری

- صفحه‌ها (`app/(app)/page.tsx`) **سرور کامپوننت** هستند و فقط ویوی فیچر را رندر می‌کنند.
- ویوها (`features/*/views`) **کلاینت کامپوننت‌اند** و فقط JSX رندر می‌کنند؛ منطق در view-model hookها (`features/*/hooks`) است.
- جریان داده: `View → Hook → Service → Internal API Route → Backend`.
- داده سرور با **React Query** مدیریت می‌شود؛ خطاهای API در لایه کلاینت نرمال و فارسی می‌شوند.
- ناوبری با `next/link` + `usePathname` انجام می‌شود؛ تب فعال از روی URL مشخص می‌شود.
- مستندات هوش مصنوعی در پوشه `ai/` (قوانین کدنویسی، معماری فیچر، API).
