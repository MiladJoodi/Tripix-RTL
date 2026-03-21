import jalaali from "jalaali-js";

// ---------------------------------------------------------------------------
// Persian digits
// ---------------------------------------------------------------------------
export function toPersianDigits(str: string | number): string {
  return String(str).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
}

// ---------------------------------------------------------------------------
// Time / Duration
// ---------------------------------------------------------------------------
export function formatTime(time: string): string {
  return toPersianDigits(time.slice(0, 5));
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${toPersianDigits(m)} دقیقه`;
  if (m === 0) return `${toPersianDigits(h)} ساعت`;
  return `${toPersianDigits(h)} ساعت و ${toPersianDigits(m)} دقیقه`;
}

// ---------------------------------------------------------------------------
// Price  –  تومان with Persian thousands separator (٬)
// ---------------------------------------------------------------------------
export function formatPrice(price: number): string {
  const formatted = price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  return `${toPersianDigits(formatted)} تومان`;
}

// ---------------------------------------------------------------------------
// Jalali date helpers
// ---------------------------------------------------------------------------
const jMonthNames = [
  "فروردین", "اردیبهشت", "خرداد",
  "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر",
  "دی", "بهمن", "اسفند",
];

const jWeekdays = [
  "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه",
];

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const { jy, jm, jd } = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return toPersianDigits(`${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`);
}

export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  const { jy, jm, jd } = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  const weekday = jWeekdays[date.getDay()];
  return `${weekday}، ${toPersianDigits(jd)} ${jMonthNames[jm - 1]} ${toPersianDigits(jy)}`;
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------
export function generateBookingRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getTimeOfDay(time: string): "morning" | "afternoon" | "evening" | "night" {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}
