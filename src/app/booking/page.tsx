"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/store/booking-store";
import { useSearchStore } from "@/store/search-store";
import { Passenger } from "@/types";
import { Stepper } from "@/components/ui/stepper";
import { PageHeader } from "@/components/layout/page-header";
import { PassengerForm } from "@/features/booking/passenger-form";
import { ReviewStep } from "@/features/booking/review-step";
import { PaymentStep, PaymentMethod } from "@/features/booking/payment-step";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatPrice,
  formatTime,
  formatDuration,
  delay,
  toPersianDigits,
} from "@/utils/helpers";
import { toast } from "sonner";

const steps = ["مسافران", "بررسی", "پرداخت"];

function BookingContent() {
  const router = useRouter();
  const {
    selectedTicket,
    step,
    setStep,
    setPassengers,
    confirmBooking,
    currentBooking,
  } = useBookingStore();
  const { passengers: paxCount } = useSearchStore();
  const [passengerData, setPassengerData] = useState<Passenger[]>([]);
  const [processing, setProcessing] = useState(false);
  const pendingRef = useRef<Passenger[]>([]);
  const submittedCount = useRef(0);

  const count = Math.max(1, paxCount);

  // Redirect after successful payment confirmation
  useEffect(() => {
    if (currentBooking && step === 3) {
      router.push(`/confirmation/?id=${currentBooking.id}`);
    }
  }, [currentBooking, step, router]);

  if (!selectedTicket) {
    return (
      <div>
        <PageHeader title="رزرو" showBack />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <p className="text-text-secondary text-center mb-4">
            بلیطی انتخاب نشده است. لطفاً ابتدا جستجو کنید و بلیط مورد نظر را
            انتخاب کنید.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            بازگشت به خانه
          </button>
        </div>
      </div>
    );
  }

  function handlePassengerSubmit(data: Passenger, index: number) {
    pendingRef.current[index] = data;
    submittedCount.current += 1;

    if (submittedCount.current >= count) {
      const contact = pendingRef.current[0];
      const merged = pendingRef.current.slice(0, count).map((p, i) => ({
        ...p,
        email: i === 0 ? p.email : contact?.email || p.email || "",
        phone: i === 0 ? p.phone : contact?.phone || p.phone || "",
      }));

      const valid = merged.every((p) => p?.firstName && p?.lastName && p?.idNumber);
      if (!valid || !contact?.phone || !contact?.email) {
        toast.error("لطفاً اطلاعات تمام مسافران و تماس را تکمیل کنید");
        submittedCount.current = 0;
        return;
      }

      setPassengerData(merged);
      setPassengers(merged);
      setStep(1);
      submittedCount.current = 0;
    }
  }

  function handleContinue() {
    if (step === 0) {
      submittedCount.current = 0;
      pendingRef.current = [];
      for (let i = 0; i < count; i++) {
        const form = document.getElementById(
          `passenger-form-${i}`
        ) as HTMLFormElement | null;
        if (form) form.requestSubmit();
      }
      // Fallback if some forms fail validation (no submit fired)
      setTimeout(() => {
        if (submittedCount.current < count && submittedCount.current > 0) {
          toast.error("لطفاً اطلاعات تمام مسافران را تکمیل کنید");
          submittedCount.current = 0;
        } else if (submittedCount.current === 0) {
          toast.error("لطفاً اطلاعات تمام مسافران را تکمیل کنید");
        }
      }, 200);
    } else if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      const btn = document.getElementById("payment-submit");
      btn?.click();
    }
  }

  async function handlePay(_method: PaymentMethod) {
    setProcessing(true);
    await delay(1800);
    confirmBooking();
    setProcessing(false);
    toast.success("پرداخت با موفقیت انجام شد");
  }

  const ctaLabel =
    step === 0
      ? "ادامه و بررسی"
      : step === 1
      ? "ادامه به پرداخت"
      : processing
      ? "در حال پرداخت..."
      : `پرداخت ${formatPrice(selectedTicket.price * count)}`;

  return (
    <div className="pb-28 lg:pb-8">
      <PageHeader title="رزرو" showBack />

      <div className="px-4 md:px-6 py-4 max-w-2xl">
        <Stepper steps={steps} currentStep={step} />
      </div>

      <div className="px-4 md:px-6 lg:flex lg:gap-6 max-w-5xl">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="passengers"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="space-y-3"
              >
                {Array.from({ length: count }).map((_, i) => (
                  <PassengerForm
                    key={i}
                    index={i}
                    showContact={i === 0}
                    onSubmit={(data) => handlePassengerSubmit(data, i)}
                    defaultValues={passengerData[i]}
                  />
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
              >
                <ReviewStep
                  ticket={selectedTicket}
                  passengers={passengerData}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
              >
                <PaymentStep
                  totalPrice={selectedTicket.price * count}
                  onPay={handlePay}
                  processing={processing}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block w-80 shrink-0">
          <div className="bg-surface rounded-2xl shadow-sm border border-border p-5 sticky top-20">
            <h3 className="font-semibold text-text-primary mb-4">خلاصه سفر</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{selectedTicket.provider.logo}</span>
              <div>
                <p className="text-sm font-medium">
                  {selectedTicket.provider.name}
                </p>
                <p className="text-xs text-text-muted">{selectedTicket.class}</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-y border-border mb-3">
              <div>
                <p className="font-bold">
                  {formatTime(selectedTicket.departureTime)}
                </p>
                <p className="text-xs text-text-muted">
                  {selectedTicket.origin.code}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-text-muted">
                  {formatDuration(selectedTicket.duration)}
                </p>
                <div className="w-12 h-px bg-border" />
              </div>
              <div className="text-left">
                <p className="font-bold">
                  {formatTime(selectedTicket.arrivalTime)}
                </p>
                <p className="text-xs text-text-muted">
                  {selectedTicket.destination.code}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-text-secondary">
                  بلیط × {toPersianDigits(count)}
                </span>
                <span>{formatPrice(selectedTicket.price * count)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">هزینه خدمات</span>
                <span>رایگان</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border font-bold">
                <span>مبلغ کل</span>
                <span className="text-primary-600 text-lg">
                  {formatPrice(selectedTicket.price * count)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                disabled={processing}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary-600/20 transition-colors flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    در حال پرداخت...
                  </>
                ) : (
                  ctaLabel
                )}
              </motion.button>
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  disabled={processing}
                  className="w-full py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-surface-tertiary transition-colors"
                >
                  بازگشت
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-border safe-bottom lg:hidden">
        <div className="px-4 py-3 flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              disabled={processing}
              className="py-3 px-4 rounded-xl border border-border text-sm font-semibold text-text-secondary hover:bg-surface-tertiary transition-colors"
            >
              بازگشت
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            disabled={processing}
            className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary-600/20 transition-colors flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                در حال پرداخت...
              </>
            ) : (
              ctaLabel
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 md:px-6 pt-16">
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
