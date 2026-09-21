import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToaster } from "@/components/theme/theme-toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "تریپیکس — رزرو بلیط اتوبوس، قطار و هواپیما",
  description:
    "جستجو و رزرو بلیط اتوبوس، قطار و هواپیما در یک پلتفرم. بهترین قیمت‌ها و مسیرها.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('tripix-theme');
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-surface-secondary text-text-primary">
        <ThemeProvider>
          <SidebarNav />
          <div className="lg:ms-64 min-h-dvh">
            <div className="max-w-6xl mx-auto">{children}</div>
            <BottomNav />
          </div>
          <ThemeToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
