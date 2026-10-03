import * as dotenv from "dotenv";
import { getDb } from "@/database/db";
import { serviceCategories } from "@/database/schema/garage";

// tsx فایل .env را خودش لود نمی‌کند — مطابق الگوی drizzle.config.ts
dotenv.config({ path: ".env" });

interface ServiceCategorySeed {
  id: string;
  title: string;
  description: string;
  icon: string;
  defaultIntervalKm: number | null;
  defaultIntervalMonths: number | null;
}

const SERVICE_CATEGORY_SEEDS: ServiceCategorySeed[] = [
  {
    id: "engine-oil",
    title: "روغن موتور",
    description: "تعویض روغن و فیلتر روغن",
    icon: "oil_barrel",
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
  },
  {
    id: "brakes",
    title: "ترمز",
    description: "لنت، دیسک و روغن ترمز",
    icon: "disc_full",
    defaultIntervalKm: 20000,
    defaultIntervalMonths: 12,
  },
  {
    id: "tires",
    title: "تایر",
    description: "جابه‌جایی، بالانس و تعویض تایر",
    icon: "tire_repair",
    defaultIntervalKm: 10000,
    defaultIntervalMonths: 6,
  },
  {
    id: "cabin-filter",
    title: "فیلتر کابین و تهویه",
    description: "فیلتر هوا و سرویس تهویه",
    icon: "air",
    defaultIntervalKm: 15000,
    defaultIntervalMonths: 12,
  },
  {
    id: "battery",
    title: "باتری",
    description: "باتری اصلی و کمکی",
    icon: "battery_charging_full",
    defaultIntervalKm: null,
    defaultIntervalMonths: 24,
  },
  {
    id: "inspection",
    title: "بازدید دوره‌ای",
    description: "بازدید چندنقطه‌ای و معاینه فنی",
    icon: "fact_check",
    defaultIntervalKm: 10000,
    defaultIntervalMonths: 12,
  },
  {
    id: "wipers",
    title: "برف‌پاک‌کن",
    description: "تیغه و مایع شیشه‌شور",
    icon: "wiper",
    defaultIntervalKm: null,
    defaultIntervalMonths: 12,
  },
  {
    id: "alignment",
    title: "تنظیم فرمان و جلوبندی",
    description: "بالانس چرخ و تنظیم زوایا",
    icon: "settings",
    defaultIntervalKm: 20000,
    defaultIntervalMonths: 12,
  },
  {
    id: "coolant",
    title: "مایع خنک‌کننده",
    description: "ضدیخ و سیستم خنک‌کاری",
    icon: "water_drop",
    defaultIntervalKm: 40000,
    defaultIntervalMonths: 24,
  },
  {
    id: "insurance-doc",
    title: "بیمه و مدارک",
    description: "تمدید بیمه‌نامه و مدارک خودرو",
    icon: "security",
    defaultIntervalKm: null,
    defaultIntervalMonths: 12,
  },
];

async function seedServiceCategories(): Promise<typeof serviceCategories.$inferSelect[]> {
  const db = getDb();
  return db
    .insert(serviceCategories)
    .values(SERVICE_CATEGORY_SEEDS)
    .onConflictDoNothing({ target: serviceCategories.id })
    .returning();
}

seedServiceCategories()
  .then((inserted) => {
    if (inserted.length === 0) {
      console.info("دسته‌بندی‌های سرویس از قبل وجود دارند — چیزی درج نشد");
    } else {
      console.info(`${inserted.length} دسته‌بندی سرویس seed شد`);
    }
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error("خطا در seed دسته‌بندی‌های سرویس:", error);
    process.exit(1);
  });
