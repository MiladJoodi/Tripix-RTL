# تریپیکس — رزرو آنلاین بلیط سفر

یه پلتفرم رزرو بلیط سفر با طراحی مدرن و کاملاً فارسی (RTL) که باهاش می‌تونید بلیط اتوبوس، قطار و هواپیما رو توی یه جا جستجو و رزرو کنید. ساخته شده با **Next.js 16**، **React 19** و **Tailwind CSS v4**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

## امکانات

- **جستجوی چند وسیله‌ای** — اتوبوس، قطار و هواپیما همه توی یه فرم
- **جستجوی هوشمند** — حتی اگه نتیجه دقیق نباشه، پیشنهادهای نزدیک نشون میده
- **فرآیند کامل رزرو** — از جستجو تا تایید نهایی و دریافت کد رزرو
- **ریسپانسیو** — طراحی Mobile-first با پشتیبانی کامل دسکتاپ (ساید‌بار، چیدمان چندستونی)
- **فیلتر و مرتب‌سازی** — بر اساس قیمت، ساعت حرکت، تعداد توقف و ...
- **مدیریت رزروها** — لیست رزروها با وضعیت هر کدوم
- **پروفایل کاربر** — روش‌های پرداخت، اعلان‌ها، تنظیمات حریم خصوصی و پشتیبانی
- **انیمیشن روان** — ترنزیشن‌های Framer Motion و انیمیشن‌های ریز و درشت
- **تقویم شمسی (جلالی)** — انتخاب تاریخ با تقویم فارسی
- **اعداد و قیمت فارسی** — همه چیز با ارقام فارسی و واحد تومان
- **ذخیره‌سازی محلی** — جستجوهای اخیر و رزروها توی مرورگر ذخیره می‌شن

## تکنولوژی‌ها

| تکنولوژی | کاربرد |
|---|---|
| [Next.js 16](https://nextjs.org/) | App Router، خروجی استاتیک |
| [React 19](https://react.dev/) | کتابخانه رابط کاربری |
| [TypeScript 5](https://www.typescriptlang.org/) | تایپ‌سیفتی |
| [Tailwind CSS v4](https://tailwindcss.com/) | استایل‌دهی با تم سفارشی |
| [Zustand](https://zustand-demo.pmnd.rs/) | مدیریت استیت |
| [Framer Motion](https://www.framer.com/motion/) | انیمیشن‌ها |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | فرم و اعتبارسنجی |
| [jalaali-js](https://github.com/jalaali/jalaali-js) | تبدیل تاریخ میلادی به شمسی |
| [react-multi-date-picker](https://shahabyazdi.github.io/react-multi-date-picker/) | دیت‌پیکر شمسی |
| [Lucide React](https://lucide.dev/) | آیکون‌ها |
| [Sonner](https://sonner.emilkowal.dev/) | نوتیفیکیشن‌ها |

## شروع کار

### پیش‌نیازها

- Node.js نسخه 20 به بالا
- npm

### نصب

```bash
git clone https://github.com/MiladJoodi/Tripix-RTL.git
cd Tripix-RTL
npm install
```

### اجرای محلی

```bash
npm run dev
```

بعد از اجرا، آدرس [http://localhost:3000](http://localhost:3000) رو توی مرورگر باز کنید.

### بیلد

```bash
npm run build
```

فایل‌های استاتیک توی پوشه `out/` ساخته می‌شن.

## ساختار پروژه

```
src/
├── app/                    # صفحات Next.js App Router
│   ├── page.tsx            # صفحه اصلی — هیرو، فرم جستجو، مسیرهای پرطرفدار
│   ├── search/             # نتایج جستجو با فیلتر
│   ├── ticket/             # جزئیات بلیط
│   ├── booking/            # فرآیند رزرو چندمرحله‌ای
│   ├── confirmation/       # تاییدیه رزرو
│   ├── bookings/           # لیست رزروهای من
│   └── profile/            # پروفایل و تنظیمات کاربر
├── components/
│   ├── layout/             # ساید‌بار، نوار پایین، هدر صفحات
│   └── ui/                 # کارت بلیط، تایم‌لاین، استپر، اسکلتون و ...
├── features/
│   ├── search/             # فرم جستجو، انتخاب شهر، دیت‌پیکر، فیلترها
│   └── booking/            # فرم مسافر، مرحله بررسی
├── store/                  # استورهای Zustand (جستجو، رزرو، کاربر)
├── data/                   # داده‌های نمونه (۱۸۰+ بلیط، ۱۵ شهر، ۱۷ شرکت)
├── types/                  # اینترفیس‌های TypeScript
└── utils/                  # توابع کمکی
```

## دیپلوی

این پروژه برای دیپلوی روی **Netlify** با خروجی استاتیک آماده‌ست.

### دیپلوی روی Netlify

1. ریپو رو روی GitHub پوش کنید
2. توی [Netlify](https://app.netlify.com/) ریپو رو کانکت کنید
3. تنظیمات بیلد از `netlify.toml` خودکار شناسایی می‌شه
4. دیپلوی!

تنظیمات بیلد از قبل آماده‌ست:
- **دستور بیلد:** `npm run build`
- **پوشه خروجی:** `out`

## اسکرین‌شات

### موبایل
- صفحه اصلی با فرم جستجو و مسیرهای پرطرفدار
- نتایج جستجو با مودال فیلتر
- جزئیات بلیط با تایم‌لاین سفر
- فرآیند رزرو چندمرحله‌ای
- تاییدیه رزرو

### دسکتاپ
- ساید‌بار ناوبری با چیدمان چندستونی
- فیلتر کنار نتایج جستجو
- خلاصه سفر در کنار فرم رزرو

## توسعه‌دهنده

**میلاد جودی**

- [لینکدین](https://www.linkedin.com/in/joodi/)
- [گیت‌هاب](https://github.com/MiladJoodi)

## لایسنس

این پروژه متن‌باز هست و تحت [لایسنس MIT](LICENSE) منتشر شده.
