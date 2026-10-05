/** نام کوکی httpOnly حاوی توکن JWT */
export const AUTH_COOKIE_NAME = "lifehub_token";

/** کوکی خوانا فقط با تاریخ انقضا — برای زمان‌بندی خروج خودکار در کلاینت (بدون اطلاعات حساس) */
export const AUTH_EXP_COOKIE_NAME = "lifehub_token_exp";

/** اعتبار توکن: ۳۰ روز */
export const AUTH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;

/** مدت اعتبار توکن یک‌بارمصرف ریست رمز عبور */
export const PASSWORD_RESET_TTL_SECONDS = 15 * 60;

/** پیام استاندارد ۴۰۱ برای همه API های داخلی */
export const UNAUTHORIZED_MESSAGE = "برای دسترسی ابتدا وارد حساب خود شوید";
