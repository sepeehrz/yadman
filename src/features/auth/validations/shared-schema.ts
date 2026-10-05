import { z } from "zod";

/** نام کاربری: حروف انگلیسی کوچک، عدد و زیرخط (در API به حروف کوچک نرمال می‌شود) */
export const usernameSchema = z
  .string()
  .trim()
  .min(3, "نام کاربری حداقل ۳ کاراکتر است")
  .max(32, "نام کاربری حداکثر ۳۲ کاراکتر است")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "نام کاربری فقط می‌تواند شامل حروف انگلیسی، عدد و زیرخط باشد",
  );

/** سیاست رمز عبور: حداقل ۸ کاراکتر شامل حرف و رقم */
export const passwordSchema = z
  .string()
  .min(8, "رمز عبور حداقل ۸ کاراکتر است")
  .max(72, "رمز عبور حداکثر ۷۲ کاراکتر است")
  .regex(/[a-zA-Z]/, "رمز عبور باید حداقل یک حرف داشته باشد")
  .regex(/[0-9]/, "رمز عبور باید حداقل یک رقم داشته باشد");

export const genderSchema = z.enum(["male", "female"], {
  message: "جنسیت الزامی است",
});

export const securityAnswerSchema = z
  .string()
  .trim()
  .min(2, "پاسخ امنیتی الزامی است")
  .max(120, "پاسخ امنیتی حداکثر ۱۲۰ کاراکتر است");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "نام الزامی است")
  .max(60, "نام حداکثر ۶۰ کاراکتر است");

export const lastNameSchema = z
  .string()
  .trim()
  .min(2, "نام خانوادگی الزامی است")
  .max(60, "نام خانوادگی حداکثر ۶۰ کاراکتر است");

/** پذیرش قوانین و مقررات — در ثبت‌نام اجباری است */
export const acceptTermsSchema = z.boolean().refine(
  (value) => value === true,
  "پذیرش قوانین و مقررات الزامی است",
);
