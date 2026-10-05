/** سوالات امنیتی مجاز برای جریان بازیابی رمز عبور (بدون نیاز به ایمیل) */
export const SECURITY_QUESTIONS = [
  "نام اولین مدرسه شما چه بود؟",
  "نام حیوان خانگی اول شما چه بود؟",
  "نام شهر محل تولد شما چیست؟",
  "نام بهترین دوست دوران کودکی شما چیست؟",
  "اسم وسط مادرتان چه بود؟",
] as const;

export type SecurityQuestion = (typeof SECURITY_QUESTIONS)[number];
