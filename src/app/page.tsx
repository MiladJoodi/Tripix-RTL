"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Bus,
  Train,
  Plane,
  ChevronLeft,
  TrendingUp,
  Star,
  Shield,
  Headphones,
} from "lucide-react";
import { useSearchStore } from "@/store/search-store";
import { SearchForm } from "@/features/search/search-form";
import { TransportType, RecentSearch } from "@/types";
import { formatDate, toPersianDigits } from "@/utils/helpers";
import { useRouter } from "next/navigation";

const typeIcons: Record<TransportType, React.ReactNode> = {
  bus: <Bus className="w-3.5 h-3.5" />,
  train: <Train className="w-3.5 h-3.5" />,
  flight: <Plane className="w-3.5 h-3.5" />,
};

const typeLabels: Record<TransportType, string> = {
  bus: "اتوبوس",
  train: "قطار",
  flight: "هواپیما",
};

const popularRoutes = [
  { from: "تهران", to: "اصفهان", price: "۲۵۰,۰۰۰ تومان", type: "bus" as TransportType, duration: "۵ ساعت", fromId: "thr", toId: "ifn" },
  { from: "تهران", to: "مشهد", price: "۳۵۰,۰۰۰ تومان", type: "train" as TransportType, duration: "۱۰ ساعت", fromId: "thr", toId: "mhd" },
  { from: "تهران", to: "کیش", price: "۱,۲۰۰,۰۰۰ تومان", type: "flight" as TransportType, duration: "۲ ساعت", fromId: "thr", toId: "kih" },
  { from: "اصفهان", to: "شیراز", price: "۲۰۰,۰۰۰ تومان", type: "bus" as TransportType, duration: "۴ ساعت", fromId: "ifn", toId: "syz" },
  { from: "تهران", to: "تبریز", price: "۸۵۰,۰۰۰ تومان", type: "flight" as TransportType, duration: "۱ ساعت ۱۵ دقیقه", fromId: "thr", toId: "tbz" },
  { from: "مشهد", to: "اصفهان", price: "۴۵۰,۰۰۰ تومان", type: "train" as TransportType, duration: "۱۲ ساعت", fromId: "mhd", toId: "ifn" },
];

const features = [
  { icon: Shield, title: "رزرو امن", desc: "حفاظت اطلاعات با استاندارد امنیتی" },
  { icon: Star, title: "بهترین قیمت", desc: "مقایسه از شرکت‌های معتبر" },
  { icon: Headphones, title: "پشتیبانی ۲۴/۷", desc: "همراه شما در طول سفر" },
];

export default function HomePage() {
  const router = useRouter();
  const {
    recentSearches,
    loadRecentSearches,
    clearRecentSearches,
    setOrigin,
    setDestination,
    setDate,
    setPassengers,
    setType,
  } = useSearchStore();

  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  function handleRecentClick(search: RecentSearch) {
    const { origin, destination, date, passengers, type } = search.params;
    if (origin) setOrigin(origin);
    if (destination) setDestination(destination);
    setDate(date);
    setPassengers(passengers);
    setType(type);
    router.push(
      `/search?from=${origin?.id}&to=${destination?.id}&date=${date}&pax=${passengers}&type=${type}`
    );
  }

  function handleRouteClick(route: (typeof popularRoutes)[0]) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().split("T")[0];
    router.push(
      `/search?from=${route.fromId}&to=${route.toId}&date=${date}&pax=1&type=${route.type}`
    );
  }

  return (
    <div className="pb-20 lg:pb-8">
      {/* Hero */}
      <div className="bg-gradient-to-bl from-primary-600 via-primary-700 to-primary-800 px-5 md:px-8 pt-8 md:pt-16 pb-10 md:pb-12 lg:rounded-b-3xl">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-white/75 text-xs md:text-sm font-medium mb-1 md:mb-2 tracking-wide">
              تریپیکس
            </p>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              کجا میخوای بری؟
            </h1>
            <p className="text-white/85 text-sm md:text-base">
              جستجو و رزرو بلیط اتوبوس، قطار و هواپیما
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search card overlapping hero */}
      <div className="px-4 md:px-8 -mt-5 md:-mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-surface rounded-2xl p-4 md:p-6 shadow-lg shadow-black/10 dark:shadow-black/40 max-w-3xl"
        >
          <SearchForm />
        </motion.div>
      </div>

      <div className="px-4 md:px-8 mt-6 md:mt-8 space-y-6 md:space-y-8">
        {/* Recent searches — compact list on mobile */}
        {recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-secondary" />
                <h2 className="text-sm font-semibold text-text-primary">
                  جستجوهای اخیر
                </h2>
              </div>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                پاک کردن
              </button>
            </div>

            <div className="divide-y divide-border bg-surface rounded-xl border border-border overflow-hidden">
              {recentSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => handleRecentClick(search)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-tertiary active:bg-surface-tertiary transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-surface-tertiary flex items-center justify-center text-text-secondary shrink-0">
                    {typeIcons[search.params.type]}
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <div className="flex items-center gap-1 text-sm font-medium text-text-primary">
                      <span className="truncate">
                        {search.params.origin?.name}
                      </span>
                      <ChevronLeft className="w-3 h-3 text-text-muted shrink-0" />
                      <span className="truncate">
                        {search.params.destination?.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      {formatDate(search.params.date)} ·{" "}
                      {toPersianDigits(search.params.passengers)} مسافر
                    </p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-text-muted shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Popular routes — horizontal scroll on mobile, grid on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <TrendingUp className="w-4 h-4 text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-primary">
              مسیرهای پرطرفدار
            </h2>
          </div>

          {/* Mobile: horizontal snap scroll */}
          <div className="flex gap-2.5 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1 snap-x snap-mandatory md:hidden">
            {popularRoutes.map((route) => (
              <button
                key={`m-${route.fromId}-${route.toId}-${route.type}`}
                onClick={() => handleRouteClick(route)}
                className="snap-start shrink-0 w-[72%] max-w-[260px] p-3.5 bg-surface rounded-xl border border-border text-right active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-1.5 mb-2 text-text-muted">
                  {typeIcons[route.type]}
                  <span className="text-[10px] font-medium text-text-muted">
                    {typeLabels[route.type]}
                  </span>
                </div>
                <p className="text-sm font-semibold text-text-primary mb-1">
                  {route.from} ← {route.to}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">
                    {route.duration}
                  </span>
                  <span className="text-sm text-primary-600 font-bold">
                    از {route.price}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Desktop/tablet grid */}
          <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-3">
            {popularRoutes.map((route) => (
              <button
                key={`d-${route.fromId}-${route.toId}-${route.type}`}
                onClick={() => handleRouteClick(route)}
                className="p-4 bg-surface rounded-xl border border-border hover:border-primary-200 hover:shadow-sm transition-all text-right active:scale-[0.98] group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-muted">
                      {typeIcons[route.type]}
                    </span>
                    <span className="text-[10px] font-medium text-text-muted">
                      {typeLabels[route.type]}
                    </span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-text-muted group-hover:text-primary-400 transition-colors" />
                </div>
                <p className="text-sm font-semibold text-text-primary mb-1">
                  {route.from} ← {route.to}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    {route.duration}
                  </span>
                  <span className="text-sm text-primary-600 font-bold">
                    از {route.price}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Why Tripix — compact icon row on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="pb-2"
        >
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            چرا تریپیکس؟
          </h2>

          {/* Mobile: compact horizontal icons */}
          <div className="grid grid-cols-3 gap-2 md:hidden">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col items-center text-center gap-1.5 py-3 px-1"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-xs font-medium text-text-primary leading-tight">
                  {f.title}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: fuller cards */}
          <div className="hidden md:grid grid-cols-3 gap-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-border"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {f.title}
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed mt-0.5">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
