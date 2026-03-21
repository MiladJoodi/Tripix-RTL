import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "تریپیکس — رزرو بلیط اتوبوس، قطار و هواپیما",
  description:
    "جستجو و رزرو بلیط اتوبوس، قطار و هواپیما در یک پلتفرم. بهترین قیمت‌ها و مسیرها.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-dvh bg-surface-secondary">
        <SidebarNav />
        <div className="lg:ms-64 min-h-dvh">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
          <BottomNav />
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            className: "!rounded-xl !shadow-lg !border-slate-100",
          }}
        />
      </body>
    </html>
  );
}
