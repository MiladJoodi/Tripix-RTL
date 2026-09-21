"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Bus,
  Train,
  Plane,
  Calendar,
  Search,
  ChevronLeft,
  X,
} from "lucide-react";
import { useBookingStore } from "@/store/booking-store";
import { Booking, TransportType } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import {
  formatTime,
  formatPrice,
  formatDate,
  cn,
  toPersianDigits,
} from "@/utils/helpers";

type StatusTab = "all" | "confirmed" | "pending" | "completed" | "cancelled";

const typeIcon: Record<TransportType, React.ReactNode> = {
  bus: <Bus className="w-3.5 h-3.5" />,
  train: <Train className="w-3.5 h-3.5" />,
  flight: <Plane className="w-3.5 h-3.5" />,
};

const statusColors: Record<Booking["status"], string> = {
  confirmed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400",
  completed: "bg-surface-tertiary text-text-secondary",
};

const statusLabels: Record<Booking["status"], string> = {
  confirmed: "فعال",
  pending: "در انتظار",
  cancelled: "لغو شده",
  completed: "انجام‌شده",
};

const tabs: { id: StatusTab; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "confirmed", label: "فعال" },
  { id: "pending", label: "در انتظار" },
  { id: "completed", label: "انجام‌شده" },
  { id: "cancelled", label: "لغو شده" },
];

export default function BookingsPage() {
  const router = useRouter();
  const { bookings, loadBookings } = useBookingStore();
  const [tab, setTab] = useState<StatusTab>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const counts = useMemo(() => {
    const c: Record<StatusTab, number> = {
      all: bookings.length,
      confirmed: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const b of bookings) {
      c[b.status] += 1;
    }
    return c;
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (tab !== "all" && b.status !== tab) return false;
      if (!q) return true;
      const hay = [
        b.bookingRef,
        b.ticket.origin.name,
        b.ticket.destination.name,
        b.ticket.provider.name,
        b.passengers.map((p) => `${p.firstName} ${p.lastName}`).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [bookings, tab, query]);

  return (
    <div className="pb-20 lg:pb-8">
      <PageHeader title="رزروهای من" />

      <div className="px-4 md:px-6 pt-2 max-w-5xl">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو بر اساس مسیر، شرکت یا کد رزرو..."
            className="w-full pr-10 pl-10 py-2.5 rounded-xl border border-border bg-surface text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-text-muted hover:text-text-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-3 mb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                tab === t.id
                  ? "bg-primary-600 text-white"
                  : "bg-surface border border-border text-text-secondary"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "min-w-[1.1rem] text-center rounded-full px-1 text-[10px]",
                  tab === t.id
                    ? "bg-white/20 text-white"
                    : "bg-surface-tertiary text-text-muted"
                )}
              >
                {toPersianDigits(counts[t.id])}
              </span>
            </button>
          ))}
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            icon={<Ticket className="w-8 h-8 text-text-muted" />}
            title="هنوز رزروی ندارید"
            description="مسیرهای داخلی ایران را جستجو کنید و اولین بلیط خود را رزرو کنید."
            action={
              <button
                onClick={() => router.push("/")}
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                جستجوی بلیط
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="w-8 h-8 text-text-muted" />}
            title="نتیجه‌ای یافت نشد"
            description={
              query
                ? "عبارت جستجو یا فیلتر وضعیت را تغییر دهید."
                : "در این دسته رزروی وجود ندارد."
            }
            action={
              <button
                onClick={() => {
                  setTab("all");
                  setQuery("");
                }}
                className="px-4 py-2 bg-surface-tertiary text-text-primary rounded-xl text-sm font-medium"
              >
                پاک کردن فیلترها
              </button>
            }
          />
        ) : (
          <div className="space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
            <AnimatePresence mode="popLayout">
              {filtered.map((booking, i) => (
                <motion.button
                  key={booking.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  onClick={() =>
                    router.push(`/confirmation/?id=${booking.id}`)
                  }
                  className="w-full bg-surface rounded-xl p-3.5 md:p-4 border border-border text-right active:scale-[0.98] transition-transform hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">
                        {booking.ticket.provider.logo}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {booking.ticket.origin.name} ←{" "}
                          {booking.ticket.destination.name}
                        </p>
                        <p className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                          {typeIcon[booking.ticket.type]}
                          <span className="truncate">
                            {booking.ticket.provider.name}
                          </span>
                          <span className="text-text-muted">·</span>
                          <span className="truncate">{booking.bookingRef}</span>
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0",
                        statusColors[booking.status]
                      )}
                    >
                      {statusLabels[booking.status]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="font-bold tabular-nums text-text-primary">
                        {formatTime(booking.ticket.departureTime)}
                      </span>
                      <span className="text-text-muted">·</span>
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <Calendar className="w-3 h-3" />
                        {formatDate(booking.bookedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-primary-600 text-sm tabular-nums">
                        {formatPrice(booking.totalPrice)}
                      </span>
                      <ChevronLeft className="w-4 h-4 text-text-muted" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
