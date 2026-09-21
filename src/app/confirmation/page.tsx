"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Download,
  Home,
  Copy,
  Bus,
  Train,
  Plane,
  Users,
} from "lucide-react";
import { useBookingStore } from "@/store/booking-store";
import { Booking, TransportType } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import {
  formatTime,
  formatDuration,
  formatPrice,
  formatFullDate,
  toPersianDigits,
  cn,
} from "@/utils/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const typeIcon: Record<TransportType, React.ReactNode> = {
  bus: <Bus className="w-4 h-4" />,
  train: <Train className="w-4 h-4" />,
  flight: <Plane className="w-4 h-4" />,
};

const typeLabels: Record<TransportType, string> = {
  bus: "اتوبوس",
  train: "قطار",
  flight: "هواپیما",
};

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentBooking, bookings, loadBookings } = useBookingStore();
  const [booking, setBooking] = useState<Booking | null>(null);

  const id = searchParams.get("id") || "";

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    if (currentBooking && currentBooking.id === id) {
      setBooking(currentBooking);
    } else {
      const found = bookings.find((b) => b.id === id);
      if (found) setBooking(found);
    }
  }, [id, currentBooking, bookings]);

  if (!booking) {
    return (
      <div>
        <PageHeader title="تاییدیه" />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-text-secondary">رزرو یافت نشد</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm hover:bg-primary-700 transition-colors"
          >
            بازگشت به خانه
          </button>
        </div>
      </div>
    );
  }

  function copyRef() {
    navigator.clipboard.writeText(booking!.bookingRef);
    toast.success("کد رزرو کپی شد!");
  }

  function downloadTicket() {
    toast.success("بلیط دانلود شد (نمونه)");
  }

  return (
    <div className="pb-8">
      <PageHeader title="رزرو تایید شد" showBack />

      <div className="px-4 md:px-6 pt-4 max-w-4xl">
        {/* Desktop: 2 columns | Mobile: stacked */}
        <div className="lg:flex lg:gap-8">
          {/* Left: success + ref */}
          <div className="lg:w-80 shrink-0 mb-6 lg:mb-0">
            {/* Success */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, delay: 0.1 }}
              className="flex flex-col items-center text-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-1">
                !رزرو شما با موفقیت انجام شد
              </h2>
              <p className="text-sm text-text-secondary">
                بلیط شما با موفقیت رزرو شد
              </p>
            </motion.div>

            {/* Booking ref */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary-50 rounded-2xl p-4 mb-4 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-primary-600 font-medium">
                  کد رزرو
                </p>
                <p className="text-lg font-bold text-primary-700 tracking-wider">
                  {booking.bookingRef}
                </p>
              </div>
              <button
                onClick={copyRef}
                className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5 text-primary-600" />
              </button>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <button
                onClick={downloadTicket}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                دانلود بلیط (نمونه)
              </button>
              <button
                onClick={() => router.push("/bookings")}
                className="w-full py-3 bg-surface-tertiary hover:bg-border text-text-primary rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4" />
                بلیط‌های من
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full py-2.5 text-text-secondary text-sm font-medium flex items-center justify-center gap-2 hover:text-text-primary transition-colors"
              >
                <Home className="w-4 h-4" />
                بازگشت به خانه
              </button>
            </motion.div>
          </div>

          {/* Right: Ticket details */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden"
            >
              {/* Ticket header */}
              <div className="bg-surface-tertiary px-4 md:px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {booking.ticket.provider.logo}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {booking.ticket.provider.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {booking.ticket.class}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-text-secondary">
                  {typeIcon[booking.ticket.type]}
                  <span className="text-xs font-medium">
                    {typeLabels[booking.ticket.type]}
                  </span>
                </div>
              </div>

              <div className="p-4 md:p-5">
                {/* Route */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-2xl font-bold">
                      {formatTime(booking.ticket.departureTime)}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {booking.ticket.origin.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {booking.ticket.origin.code}
                    </p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs text-text-muted">
                      {formatDuration(booking.ticket.duration)}
                    </p>
                    <div className="w-20 flex items-center my-1">
                      <div className="w-2 h-2 rounded-full bg-primary-400" />
                      <div className="flex-1 h-px bg-border" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-xs text-text-muted">
                      {booking.ticket.stops.length === 0
                        ? "مستقیم"
                        : `${toPersianDigits(booking.ticket.stops.length)} توقف`}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold">
                      {formatTime(booking.ticket.arrivalTime)}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {booking.ticket.destination.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {booking.ticket.destination.code}
                    </p>
                  </div>
                </div>

                {/* Passengers */}
                <div className="border-t border-dashed border-border pt-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-text-muted" />
                    <p className="text-xs font-medium text-text-muted tracking-wide">
                      مسافران
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {booking.passengers.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 bg-surface-tertiary rounded-lg"
                      >
                        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">
                          {p.firstName[0]}
                          {p.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {p.firstName} {p.lastName}
                          </p>
                          <p className="text-xs text-text-muted">{p.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking info */}
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">تاریخ رزرو</span>
                    <span className="font-medium">
                      {formatFullDate(booking.bookedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">وضعیت</span>
                    <span
                      className={cn(
                        "font-medium",
                        booking.status === "confirmed" && "text-emerald-600",
                        booking.status === "pending" && "text-amber-600",
                        booking.status === "cancelled" && "text-red-600",
                        booking.status === "completed" && "text-text-secondary"
                      )}
                    >
                      {booking.status === "confirmed"
                        ? "فعال"
                        : booking.status === "pending"
                        ? "در انتظار پرداخت"
                        : booking.status === "cancelled"
                        ? "لغو شده"
                        : "انجام‌شده"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border text-base">
                    <span className="font-semibold text-text-primary">
                      مبلغ کل
                    </span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(booking.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div>
          <PageHeader title="تاییدیه" />
          <div className="px-4 md:px-6 space-y-4 pt-4 max-w-4xl">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
