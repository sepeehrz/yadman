import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import type { Database } from "./database.types";

/**
 * Neon HTTP driver — مناسب محیط serverless/Edge نکست.
 * نکته: این درایور تراکنش تعاملی (db.transaction) ندارد؛
 * برای منطق چندکوئری اتمیک باید تک‌استیمنت یا تابع سمت دیتابیس استفاده شود.
 *
 * فقط در سرور (Route Handler / Server Action / Server Component) استفاده شود —
 * هرگز در کلاینت کامپوننت import نشود.
 */

function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL تنظیم نشده است. آن را در فایل .env قرار دهید (نمونه: .env.example).",
    );
  }
  return url;
}

// تنبل‌سازی: به‌جای کرش گنگ زمان import، خطای شفاف فقط زمان اولین استفاده.
// این از شکست بیلد (prerender) وقتی env ست نیست هم جلوگیری می‌کند.
let dbInstance: Database | null = null;

export function getDb(): Database {
  if (!dbInstance) {
    const sql = neon(getConnectionString());
    dbInstance = drizzle(sql, { schema });
  }
  return dbInstance;
}

export const db: Database = new Proxy({} as Database, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
