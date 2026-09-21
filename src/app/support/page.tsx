"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Send,
  Bot,
  User,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { cn, delay, toPersianDigits } from "@/utils/helpers";

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  time: string;
};

const faqs = [
  {
    q: "چگونه رزرو خود را لغو کنم؟",
    a: "از بخش رزروهای من، رزرو مورد نظر را باز کنید. در صورت امکان لغو، گزینه لغو نمایش داده می‌شود و مبلغ طبق قوانین شرکت حمل‌ونقل بازمی‌گردد.",
  },
  {
    q: "بلیط را چطور دریافت کنم؟",
    a: "پس از پرداخت موفق، بلیط در رزروهای من و ایمیل شما ذخیره می‌شود. می‌توانید نسخه نمونه را از صفحه تایید دانلود کنید.",
  },
  {
    q: "پرداخت ناموفق شد؛ چه کار کنم؟",
    a: "اگر مبلغ از حساب کسر شده، معمولاً تا ۷۲ ساعت برمی‌گردد. در غیر این صورت از طریق چت پشتیبانی کد پیگیری بانکی را ارسال کنید.",
  },
  {
    q: "آیا امکان تغییر تاریخ وجود دارد؟",
    a: "بسته به قوانین شرکت، تا ۲۴ ساعت قبل از حرکت ممکن است تغییر تاریخ با اختلاف قیمت امکان‌پذیر باشد.",
  },
];

const quickReplies = [
  "وضعیت رزرو من چیست؟",
  "مشکل در پرداخت دارم",
  "می‌خواهم بلیط را لغو کنم",
  "کد تخفیف ندارم؟",
];

const agentReplies: Record<string, string> = {
  default:
    "پیامتان دریافت شد. یک لحظه بررسی می‌کنم و راهنمایی‌تان می‌کنم.",
  وضعیت:
    "برای پیگیری وضعیت، کد رزرو (مثلاً TPX-A1B2C3) را بفرستید یا از بخش «رزروهای من» وضعیت را ببینید.",
  پرداخت:
    "اگر پرداخت ناموفق بوده و مبلغ کسر شده، تا ۷۲ ساعت برگشت می‌خورد. در صورت نیاز کد پیگیری بانکی را اینجا بفرستید.",
  لغو: "لغو از صفحه جزئیات رزرو فعال امکان‌پذیر است. اگر گزینه را نمی‌بینید، کد رزرو را بفرستید تا برایتان چک کنم.",
  تخفیف:
    "فعلاً کد تخفیف عمومی فعال نیست؛ پیشنهادهای ویژه در اعلان‌های اپ اعلام می‌شود.",
  سلام: "سلام! من سارا از پشتیبانی تریپیکس هستم. چطور می‌تونم کمکتون کنم؟",
};

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function pickReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("سلام") || t.includes("درود")) return agentReplies["سلام"];
  if (t.includes("وضعیت") || t.includes("رزرو")) return agentReplies["وضعیت"];
  if (t.includes("پرداخت") || t.includes("پول") || t.includes("کارت"))
    return agentReplies["پرداخت"];
  if (t.includes("لغو") || t.includes("کنسل")) return agentReplies["لغو"];
  if (t.includes("تخفیف") || t.includes("کد")) return agentReplies["تخفیف"];
  return agentReplies.default;
}

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "agent",
      text: "سلام! من سارا از پشتیبانی تریپیکس هستم. چطور می‌تونم کمکتون کنم؟",
      time: nowTime(),
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing, chatOpen]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      text: trimmed,
      time: nowTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    await delay(900 + Math.random() * 800);
    setTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: `a_${Date.now()}`,
        role: "agent",
        text: pickReply(trimmed),
        time: nowTime(),
      },
    ]);
  }

  return (
    <div className="pb-20 lg:pb-8">
      <PageHeader title="پشتیبانی" />

      <div className="px-4 md:px-6 pt-2 max-w-3xl space-y-4">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-bl from-primary-600 to-primary-800 p-5 text-white"
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg mb-1">ما اینجاییم کمکتون کنیم</h2>
              <p className="text-sm text-white/85 leading-relaxed">
                سوالات متداول را ببینید یا مستقیم با اپراتور گفتگو کنید.
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-xs text-white/70">
                <Clock className="w-3.5 h-3.5" />
                میانگین پاسخ: کمتر از {toPersianDigits(2)} دقیقه
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-3 p-3.5 bg-surface rounded-xl border border-border text-right hover:border-primary-200 hover:shadow-sm transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">چت با اپراتور</p>
              <p className="text-[11px] text-emerald-600">آنلاین الآن</p>
            </div>
          </button>
          <a
            href="tel:02191009100"
            className="flex items-center gap-3 p-3.5 bg-surface rounded-xl border border-border text-right hover:border-primary-200 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-tertiary text-text-secondary flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">تماس تلفنی</p>
              <p className="text-[11px] text-text-muted" dir="ltr">
                ۰۲۱-۹۱۰۰۹۱۰۰
              </p>
            </div>
          </a>
          <a
            href="mailto:support@tripix.ir"
            className="flex items-center gap-3 p-3.5 bg-surface rounded-xl border border-border text-right hover:border-primary-200 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-tertiary text-text-secondary flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">ایمیل</p>
              <p className="text-[11px] text-text-muted">support@tripix.ir</p>
            </div>
          </a>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-2.5">
            سوالات متداول
          </h3>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden divide-y divide-border-light">
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-right"
                  >
                    <span className="text-sm font-medium text-text-primary">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-text-muted shrink-0 transition-transform",
                        open && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-3.5 text-sm text-text-secondary leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          شروع گفتگو با اپراتور
        </button>
      </div>

      {/* Chat widget — کادر کوچک گوشه */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setChatOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", damping: 26, stiffness: 340 }}
              className="fixed z-50 bottom-20 left-3 right-3 sm:left-auto sm:right-4 sm:w-[360px] h-[min(480px,68dvh)] flex flex-col bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden"
            >
              {/* Chat header */}
              <div className="flex items-center justify-between px-3.5 py-3 border-b border-border shrink-0 bg-primary-600 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                    <span className="absolute bottom-0 left-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">سارا — پشتیبانی</p>
                    <p className="text-[11px] text-white/80">آنلاین</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-0 bg-surface-secondary"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex gap-2",
                      m.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        m.role === "user"
                          ? "bg-primary-600 text-white"
                          : "bg-surface text-text-secondary border border-border"
                      )}
                    >
                      {m.role === "user" ? (
                        <User className="w-3 h-3" />
                      ) : (
                        <Bot className="w-3 h-3" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "max-w-[78%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
                        m.role === "user"
                          ? "bg-primary-600 text-white rounded-tl-md"
                          : "bg-surface text-text-primary border border-border rounded-tr-md"
                      )}
                    >
                      <p>{m.text}</p>
                      <p
                        className={cn(
                          "text-[10px] mt-1",
                          m.role === "user"
                            ? "text-primary-200"
                            : "text-text-muted"
                        )}
                      >
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-2 items-center text-xs text-text-muted px-1">
                    <div className="w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center">
                      <Bot className="w-3 h-3" />
                    </div>
                    <span className="bg-surface border border-border rounded-full px-3 py-1.5">
                      در حال نوشتن
                      <span className="inline-flex gap-0.5 ms-1">
                        <span className="w-1 h-1 rounded-full bg-text-muted animate-bounce" />
                        <span className="w-1 h-1 rounded-full bg-text-muted animate-bounce [animation-delay:120ms]" />
                        <span className="w-1 h-1 rounded-full bg-text-muted animate-bounce [animation-delay:240ms]" />
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Quick replies */}
              <div className="px-2.5 py-2 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 bg-surface border-t border-border-light">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="shrink-0 px-2.5 py-1 rounded-full border border-border text-[10px] text-text-secondary bg-surface hover:bg-surface-tertiary"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2 px-2.5 py-2.5 border-t border-border shrink-0 bg-surface"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 px-3 py-2 rounded-xl border border-border text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-700 transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
