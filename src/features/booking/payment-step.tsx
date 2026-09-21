"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Wallet, Building2, ShieldCheck } from "lucide-react";
import { formatPrice, cn, toPersianDigits } from "@/utils/helpers";
import { toast } from "sonner";

export type PaymentMethod = "card" | "wallet" | "gateway";

interface PaymentStepProps {
  totalPrice: number;
  onPay: (method: PaymentMethod) => void;
  processing: boolean;
}

const methods: {
  id: PaymentMethod;
  label: string;
  desc: string;
  icon: typeof CreditCard;
}[] = [
  {
    id: "gateway",
    label: "درگاه بانکی",
    desc: "پرداخت امن از طریق درگاه شبیه‌سازی‌شده",
    icon: Building2,
  },
  {
    id: "card",
    label: "کارت بانکی",
    desc: "وارد کردن اطلاعات کارت (نمونه)",
    icon: CreditCard,
  },
  {
    id: "wallet",
    label: "کیف‌پول تریپیکس",
    desc: "موجودی نمونه: ۲٬۵۰۰٬۰۰۰ تومان",
    icon: Wallet,
  },
];

export function PaymentStep({ totalPrice, onPay, processing }: PaymentStepProps) {
  const [method, setMethod] = useState<PaymentMethod>("gateway");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  function formatCardInput(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function handleSubmit() {
    if (method === "card") {
      const digits = cardNumber.replace(/\s/g, "");
      if (digits.length < 16 || cardExpiry.length < 4 || cardCvv.length < 3) {
        toast.error("لطفاً اطلاعات کارت را کامل وارد کنید");
        return;
      }
    }
    onPay(method);
  }

  const cardValid =
    method !== "card" ||
    (cardNumber.replace(/\s/g, "").length === 16 &&
      cardExpiry.replace(/\D/g, "").length >= 4 &&
      cardCvv.length >= 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Amount */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 text-center">
        <p className="text-xs text-primary-600 mb-1">مبلغ قابل پرداخت</p>
        <p className="text-2xl font-bold text-primary-700 tabular-nums">
          {formatPrice(totalPrice)}
        </p>
      </div>

      {/* Methods */}
      <div className="bg-surface rounded-2xl p-4 shadow-sm border border-border space-y-2">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          روش پرداخت
        </h3>
        {methods.map((m) => {
          const selected = method === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-xl border text-right transition-colors",
                selected
                  ? "border-primary-400 bg-primary-50/60"
                  : "border-border hover:bg-surface-tertiary"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  selected ? "bg-primary-100 text-primary-600" : "bg-surface-tertiary text-text-muted"
                )}
              >
                <m.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{m.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{m.desc}</p>
              </div>
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 mt-1 shrink-0",
                  selected
                    ? "border-primary-600 bg-primary-600"
                    : "border-text-muted"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Fake card fields */}
      {method === "card" && (
        <div className="bg-surface rounded-2xl p-4 shadow-sm border border-border space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            اطلاعات کارت
          </h3>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">
              شماره کارت
            </label>
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
              inputMode="numeric"
              placeholder="۶۰۳۷ **** **** ****"
              dir="ltr"
              className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 tracking-wider"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                تاریخ انقضا
              </label>
              <input
                value={cardExpiry}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setCardExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                }}
                inputMode="numeric"
                placeholder="۰۸/۰۶"
                dir="ltr"
                className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                CVV۲
              </label>
              <input
                value={cardCvv}
                onChange={(e) =>
                  setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                inputMode="numeric"
                placeholder="•••"
                dir="ltr"
                type="password"
                className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
          <p className="text-[11px] text-text-muted">
            این یک درگاه آزمایشی است؛ اطلاعات واقعی ارسال نمی‌شود.
          </p>
        </div>
      )}

      {method === "wallet" && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800">
          <Wallet className="w-4 h-4 shrink-0" />
          <span>
            پس از تأیید، {formatPrice(totalPrice)} از کیف‌پول کسر می‌شود.
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 px-1 text-xs text-text-muted">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>
          پرداخت نمونه — تراکنش واقعی انجام نمی‌شود ({toPersianDigits(3)} ثانیه)
        </span>
      </div>

      {/* Hidden trigger used by parent CTA via form id pattern — pay via exposed handler */}
      <button
        type="button"
        id="payment-submit"
        onClick={handleSubmit}
        disabled={processing || !cardValid}
        className="hidden"
        aria-hidden
      />
    </motion.div>
  );
}
