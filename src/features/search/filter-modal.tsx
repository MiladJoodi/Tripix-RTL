"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";
import { useSearchStore } from "@/store/search-store";
import { FilterState } from "@/types";
import { cn, formatPrice } from "@/utils/helpers";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
}

const departureOptions = [
  { value: "any", label: "همه" },
  { value: "morning", label: "صبح (۵-۱۲)" },
  { value: "afternoon", label: "ظهر (۱۲-۱۷)" },
  { value: "evening", label: "عصر (۱۷-۲۱)" },
  { value: "night", label: "شب (۲۱-۵)" },
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

export function FilterModal({ open, onClose }: FilterModalProps) {
  const { filters, setFilters, resetFilters } = useSearchStore();
  const [local, setLocal] = useState<FilterState>(filters);

  useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  function apply() {
    setFilters(local);
    onClose();
  }

  function reset() {
    resetFilters();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto safe-bottom"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <h2 className="text-lg font-bold text-text-primary">فیلترها</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="px-5 pb-6 space-y-6">
              {/* Sort by */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">مرتب‌سازی</h3>
                <div className="flex gap-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setLocal({ ...local, sortBy: opt.value })}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                        local.sortBy === opt.value
                          ? "bg-primary-600 text-white"
                          : "bg-slate-100 text-text-secondary hover:bg-slate-200"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  حداکثر قیمت: {formatPrice(local.priceRange[1])}
                </h3>
                <input
                  type="range"
                  min={0}
                  max={15000000}
                  step={500000}
                  value={local.priceRange[1]}
                  onChange={(e) =>
                    setLocal({
                      ...local,
                      priceRange: [0, parseInt(e.target.value)],
                    })
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
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  ساعت حرکت
                </h3>
                <div className="flex flex-wrap gap-2">
                  {departureOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setLocal({ ...local, departureTime: opt.value })
                      }
                      className={cn(
                        "px-3 py-2 rounded-xl text-sm font-medium transition-all",
                        local.departureTime === opt.value
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
                <h3 className="text-sm font-semibold text-text-primary mb-3">توقف</h3>
                <div className="flex gap-2">
                  {stopsOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setLocal({ ...local, stopsOnly: opt.value })
                      }
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                        local.stopsOnly === opt.value
                          ? "bg-primary-600 text-white"
                          : "bg-slate-100 text-text-secondary hover:bg-slate-200"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 px-5 py-4 bg-white border-t border-slate-100 flex gap-3 safe-bottom">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-text-secondary hover:bg-slate-50 transition-colors"
              >
                حذف فیلترها
              </button>
              <button
                onClick={apply}
                className="flex-1 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                اعمال فیلترها
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
