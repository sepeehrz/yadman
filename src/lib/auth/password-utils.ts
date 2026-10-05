import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

const BCRYPT_COST = 10;

/** هش پسورد یا پاسخ سوال امنیتی با bcrypt */
export function hashSecret(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

/** مقایسه امن مقدار ورودی با هش ذخیره‌شده */
export function verifySecret(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** تولید توکن تصادفی یک‌بارمصرف برای ریست رمز عبور */
export function generateOneTimeToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * توکن ریست فقط به‌صورت هش SHA-256 ذخیره می‌شود؛ لو رفتن ردیف دیتابیس
 * به بازیابی رمز منجر نمی‌شود.
 */
export function hashOneTimeToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
