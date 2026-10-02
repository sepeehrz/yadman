/** عدد فارسی با جداکننده هزارگان */
export function faNum(n: number): string {
  return n.toLocaleString("fa-IR");
}

/** مبلغ دلاری — ارقام انگلیسی نگه داشته می‌شود چون ارز خارجی است */
export function usd(n: number, digits = 2): string {
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function usdInt(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

/** کیلومتر با ارقام فارسی */
export function faKm(n: number): string {
  return `${faNum(n)} کیلومتر`;
}
