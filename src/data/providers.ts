import { Provider } from "@/types";

export const busProviders: Provider[] = [
  { id: "royal-safar", name: "رویال سفر", logo: "🚌", type: "bus", rating: 4.5 },
  { id: "sirosafar", name: "سیروسفر", logo: "🟢", type: "bus", rating: 4.3 },
  { id: "iran-payma", name: "ایران‌پیما", logo: "🔵", type: "bus", rating: 4.1 },
  { id: "tak-safar", name: "تک‌سفر", logo: "🟡", type: "bus", rating: 4.0 },
  { id: "hamsafar", name: "همسفر", logo: "🔴", type: "bus", rating: 4.4 },
];

export const trainProviders: Provider[] = [
  { id: "raja", name: "رجا", logo: "🚆", type: "train", rating: 4.2 },
  { id: "bonrail", name: "بن‌ریل", logo: "⚡", type: "train", rating: 4.5 },
  { id: "fadak", name: "فدک", logo: "🟡", type: "train", rating: 4.3 },
  { id: "noorolareza", name: "نورالرضا", logo: "🟢", type: "train", rating: 4.1 },
  { id: "lux-rail", name: "لوکس ریل", logo: "💎", type: "train", rating: 4.6 },
];

export const flightProviders: Provider[] = [
  { id: "iranair", name: "ایران‌ایر", logo: "✈️", type: "flight", rating: 4.0 },
  { id: "mahan", name: "ماهان", logo: "🌐", type: "flight", rating: 4.3 },
  { id: "kishair", name: "کیش‌ایر", logo: "🏝️", type: "flight", rating: 4.1 },
  { id: "aseman", name: "آسمان", logo: "💙", type: "flight", rating: 3.9 },
  { id: "zagros", name: "زاگرس", logo: "⛰️", type: "flight", rating: 4.2 },
  { id: "ata", name: "آتا", logo: "❤️", type: "flight", rating: 3.8 },
  { id: "varesh", name: "وارش", logo: "🟢", type: "flight", rating: 3.7 },
];

export const allProviders = [...busProviders, ...trainProviders, ...flightProviders];
