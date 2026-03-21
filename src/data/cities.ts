import { City } from "@/types";

export const cities: City[] = [
  { id: "thr", name: "تهران", code: "THR", country: "ایران" },
  { id: "mhd", name: "مشهد", code: "MHD", country: "ایران" },
  { id: "ifn", name: "اصفهان", code: "IFN", country: "ایران" },
  { id: "syz", name: "شیراز", code: "SYZ", country: "ایران" },
  { id: "tbz", name: "تبریز", code: "TBZ", country: "ایران" },
  { id: "awz", name: "اهواز", code: "AWZ", country: "ایران" },
  { id: "ras", name: "رشت", code: "RAS", country: "ایران" },
  { id: "qom", name: "قم", code: "QOM", country: "ایران" },
  { id: "krj", name: "کرج", code: "KRJ", country: "ایران" },
  { id: "kih", name: "کیش", code: "KIH", country: "ایران" },
  { id: "azd", name: "یزد", code: "AZD", country: "ایران" },
  { id: "ker", name: "کرمان", code: "KER", country: "ایران" },
  { id: "sry", name: "ساری", code: "SRY", country: "ایران" },
  { id: "hdm", name: "همدان", code: "HDM", country: "ایران" },
  { id: "bnd", name: "بندرعباس", code: "BND", country: "ایران" },
];

export function searchCities(query: string): City[] {
  const q = query.trim();
  if (!q) return cities.slice(0, 5);
  return cities.filter(
    (c) =>
      c.name.includes(q) ||
      c.code.toLowerCase().includes(q.toLowerCase())
  );
}
