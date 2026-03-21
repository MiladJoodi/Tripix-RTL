"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  CreditCard,
  Settings,
  Globe,
  Moon,
  Smartphone,
  MessageCircle,
  FileText,
  Check,
  X,
  Github,
  Linkedin,
} from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/utils/helpers";

type ActiveSection = null | "payment" | "notifications" | "privacy" | "preferences" | "help";

const paymentMethods = [
  { id: "1", type: "بانک ملی", last4: "۴۲۴۲", expiry: "۱۲/۰۶", isDefault: true },
  { id: "2", type: "بانک پارسیان", last4: "۸۸۸۸", expiry: "۰۳/۰۵", isDefault: false },
];

const notificationSettings = [
  { id: "push", label: "اعلان رزرو", desc: "به‌روزرسانی و یادآوری رزروها", enabled: true },
  { id: "email", label: "اعلان ایمیلی", desc: "رسید و تاییدیه‌ها", enabled: true },
  { id: "promo", label: "پیشنهادات ویژه", desc: "تخفیف‌ها و پیشنهادات", enabled: false },
  { id: "sms", label: "پیامک", desc: "یادآوری سفر از طریق پیامک", enabled: false },
];

const faqItems = [
  { q: "چگونه رزرو خود را لغو کنم؟", a: "به بخش رزروهای من بروید، رزرو مورد نظر را انتخاب کنید و گزینه لغو را بزنید. مبلغ بازپرداخت ظرف ۵ تا ۷ روز کاری به حساب شما واریز می‌شود." },
  { q: "آیا امکان تغییر تاریخ سفر وجود دارد؟", a: "بله، می‌توانید تا ۲۴ ساعت قبل از حرکت، تاریخ سفر خود را از صفحه جزئیات رزرو تغییر دهید." },
  { q: "چه روش‌های پرداختی پشتیبانی می‌شود؟", a: "ما از تمامی کارت‌های بانکی عضو شتاب، پرداخت اینترنتی، کیف پول الکترونیکی و پرداخت در محل پشتیبانی می‌کنیم." },
  { q: "چگونه با پشتیبانی تماس بگیرم؟", a: "می‌توانید از طریق ایمیل support@tripix.ir یا شماره تلفن ۰۲۱-۹۱۰۰۹۱۰۰ با ما در تماس باشید." },
];

export default function ProfilePage() {
  const { user } = useUserStore();
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [notifications, setNotifications] = useState(notificationSettings);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  function toggleNotification(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  }

  if (activeSection) {
    return (
      <div className="pb-20 lg:pb-8">
        <PageHeader
          title={
            activeSection === "payment"
              ? "روش‌های پرداخت"
              : activeSection === "notifications"
              ? "اعلان‌ها"
              : activeSection === "privacy"
              ? "حریم خصوصی و امنیت"
              : activeSection === "preferences"
              ? "تنظیمات"
              : "راهنما و پشتیبانی"
          }
          showBack
        />
        <div className="px-4 md:px-6 pt-4 max-w-2xl">
          {activeSection === "payment" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {paymentMethods.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4"
                >
                  <div className="w-12 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                    {card.type === "بانک ملی" ? "ملی" : "پارسیان"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {card.type} ····{card.last4}
                    </p>
                    <p className="text-xs text-text-muted">
                      انقضا {card.expiry}
                    </p>
                  </div>
                  {card.isDefault && (
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                      کارت پیش‌فرض
                    </span>
                  )}
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-medium text-text-secondary hover:border-primary-300 hover:text-primary-600 transition-colors">
                + افزودن کارت جدید
              </button>
            </motion.div>
          )}

          {activeSection === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              {notifications.map((n, i) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-center justify-between px-4 py-4",
                    i < notifications.length - 1 && "border-b border-slate-50"
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {n.label}
                    </p>
                    <p className="text-xs text-text-muted">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(n.id)}
                    className={cn(
                      "w-11 h-6 rounded-full transition-colors relative",
                      n.enabled ? "bg-primary-600" : "bg-slate-200"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-all",
                        n.enabled ? "right-[22px]" : "right-0.5"
                      )}
                    />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection === "privacy" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <h3 className="font-semibold text-text-primary mb-3">
                  امنیت حساب
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <div>
                      <p className="text-sm font-medium">تغییر رمز عبور</p>
                      <p className="text-xs text-text-muted">
                        آخرین تغییر ۳۰ روز پیش
                      </p>
                    </div>
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
                      تغییر
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <div>
                      <p className="text-sm font-medium">
                        احراز هویت دو مرحله‌ای
                      </p>
                      <p className="text-xs text-text-muted">
                        امنیت بیشتر برای حساب شما
                      </p>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      فعال
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">مدیریت نشست‌ها</p>
                      <p className="text-xs text-text-muted">
                        ۲ دستگاه فعال
                      </p>
                    </div>
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
                      مدیریت
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <h3 className="font-semibold text-text-primary mb-3">
                  داده‌ها و حریم خصوصی
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <p className="text-sm font-medium">دانلود اطلاعات</p>
                    <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
                      درخواست
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-red-600">
                        حذف حساب کاربری
                      </p>
                      <p className="text-xs text-text-muted">
                        حذف دائمی حساب کاربری شما
                      </p>
                    </div>
                    <button className="text-xs font-medium text-red-600 hover:text-red-700">
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "preferences" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium">زبان</p>
                    <p className="text-xs text-text-muted">
                      زبان نمایش برنامه
                    </p>
                  </div>
                </div>
                <span className="text-sm text-text-secondary">فارسی</span>
              </div>
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium">واحد پول</p>
                    <p className="text-xs text-text-muted">
                      نمایش قیمت‌ها بر اساس
                    </p>
                  </div>
                </div>
                <span className="text-sm text-text-secondary">تومان (﷼)</span>
              </div>
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium">تم</p>
                    <p className="text-xs text-text-muted">ظاهر برنامه</p>
                  </div>
                </div>
                <span className="text-sm text-text-secondary">روشن</span>
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium">واحد مسافت</p>
                    <p className="text-xs text-text-muted">کیلومتر یا مایل</p>
                  </div>
                </div>
                <span className="text-sm text-text-secondary">کیلومتر</span>
              </div>
            </motion.div>
          )}

          {activeSection === "help" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* FAQ */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <h3 className="font-semibold text-text-primary px-4 pt-4 pb-2">
                  سوالات متداول
                </h3>
                {faqItems.map((item, i) => (
                  <div
                    key={i}
                    className="border-t border-slate-50"
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === i ? null : i)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 text-right"
                    >
                      <span className="text-sm font-medium text-text-primary pl-4">
                        {item.q}
                      </span>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-slate-400 shrink-0 transition-transform",
                          expandedFaq === i && "rotate-90"
                        )}
                      />
                    </button>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="px-4 pb-3"
                      >
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <h3 className="font-semibold text-text-primary mb-3">
                  تماس با ما
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium">ایمیل</p>
                      <p className="text-xs text-text-muted">
                        support@tripix.ir
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium">تلفن</p>
                      <p className="text-xs text-text-muted">
                        ۰۲۱-۹۱۰۰۹۱۰۰
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <MessageCircle className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium">گفتگوی آنلاین</p>
                      <p className="text-xs text-text-muted">
                        پشتیبانی ۲۴ ساعته
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  const menuItems = [
    { key: "payment" as ActiveSection, icon: CreditCard, label: "روش‌های پرداخت", desc: "مدیریت کارت‌های ذخیره شده" },
    { key: "notifications" as ActiveSection, icon: Bell, label: "اعلان‌ها", desc: "تنظیمات اعلان، ایمیل و پیامک" },
    { key: "privacy" as ActiveSection, icon: Shield, label: "حریم خصوصی و امنیت", desc: "رمز عبور، احراز هویت، داده‌ها" },
    { key: "preferences" as ActiveSection, icon: Settings, label: "تنظیمات", desc: "زبان، واحد پول، تم" },
    { key: "help" as ActiveSection, icon: HelpCircle, label: "راهنما و پشتیبانی", desc: "سوالات متداول و تماس با ما" },
  ];

  return (
    <div className="pb-20 lg:pb-8">
      <PageHeader title="پروفایل" />

      <div className="px-4 md:px-6 pt-4 max-w-4xl">
        {/* Desktop: side by side | Mobile: stacked */}
        <div className="lg:flex lg:gap-6">
          {/* Profile card */}
          <div className="lg:w-80 shrink-0 mb-4 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold text-primary-600">
                    {user.avatar}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-text-primary">
                    میلاد جودی
                  </h2>
                  <p className="text-xs text-text-muted">عضو از سال ۱۴۰۳</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <Mail className="w-4 h-4 text-slate-400" />
                  milad@tripix.ir
                </div>
                <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {user.phone}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-text-primary">۱۲</p>
                  <p className="text-xs text-text-muted">سفر</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-text-primary">۳</p>
                  <p className="text-xs text-text-muted">رزرو فعال</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-text-primary">۴.۸</p>
                  <p className="text-xs text-text-muted">امتیاز</p>
                </div>
              </div>

              <button className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-text-secondary hover:bg-slate-50 transition-colors">
                ویرایش پروفایل
              </button>
            </motion.div>
          </div>

          {/* Menu items */}
          <div className="flex-1 space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              {menuItems.map((item, i) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors",
                    i < menuItems.length - 1 && "border-b border-slate-50"
                  )}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-medium text-text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-text-muted">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              ))}
            </motion.div>

            {/* Logout */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-red-500 font-medium text-sm hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              خروج از حساب
            </motion.button>

            <div className="flex items-center justify-center gap-2 pt-2">
              <a
                href="https://github.com/MiladJoodi/Tripix-RTL"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/joodi/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            <p className="text-center text-xs text-text-muted pt-1">
              تریپیکس نسخه ۱.۰.۰
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
