"use client";

import { useSearchStore } from "@/store/search-store";
import { FilterState } from "@/types";
import { cn, formatPrice, toPersianDigits } from "@/utils/helpers";

const departureOptions = [
  { value: "any", label: "همه" },
  { value: "morning", label: "صبح" },
  { value: "afternoon", label: "ظهر" },
  { value: "evening", label: "عصر" },
  { value: "night", label: "شب" },
] as const;

const stopsOptions = [
  { value: "any", label: "همه" },
  { value: "direct", label: "مستقیم" },
  { value: "1stop", label: "۱ توقف" },
  { value: "2plus", label: "۲+ توقف" },
] as const;

const sortOptions = [
  { value: "best", label: "بهترین" },
  { value: "cheapest", label: "ارزان‌ترین" },
  { value: "fastest", label: "سریع‌ترین" },
] as const;

export function FilterPanel() {
  const { filters, setFilters, resetFilters } = useSearchStore();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-6 sticky top-20">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-text-primary">فیلترها</h2>
        <button
          onClick={resetFilters}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          حذف فیلترها
        </button>
      </div>

      {/* Sort by */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-2.5">مرتب‌سازی</h3>
        <div className="space-y-1.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilters({ sortBy: opt.value })}
              className={cn(
                "w-full text-right px-3 py-2 rounded-lg text-sm font-medium transition-all",
                filters.sortBy === opt.value
                  ? "bg-primary-50 text-primary-600"
                  : "text-text-secondary hover:bg-slate-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-2.5">
          حداکثر قیمت: {formatPrice(filters.priceRange[1])}
        </h3>
        <input
          type="range"
          min={0}
          max={15000000}
          step={500000}
          value={filters.priceRange[1]}
          onChange={(e) =>
            setFilters({ priceRange: [0, parseInt(e.target.value)] })
          }
          className="w-full accent-primary-600"
        />
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(15000000)}</span>
        </div>
      </div>

      {/* Departure time */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-2.5">
          ساعت حرکت
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {departureOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilters({ departureTime: opt.value })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filters.departureTime === opt.value
                  ? "bg-primary-600 text-white"
                  : "bg-slate-100 text-text-secondary hover:bg-slate-200"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stops */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-2.5">توقف</h3>
        <div className="space-y-1.5">
          {stopsOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilters({ stopsOnly: opt.value })}
              className={cn(
                "w-full text-right px-3 py-2 rounded-lg text-sm font-medium transition-all",
                filters.stopsOnly === opt.value
                  ? "bg-primary-50 text-primary-600"
                  : "text-text-secondary hover:bg-slate-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
