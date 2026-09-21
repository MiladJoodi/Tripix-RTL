"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Ticket, User, Headphones } from "lucide-react";
import { cn } from "@/utils/helpers";

const navItems = [
  { href: "/", icon: Home, label: "خانه" },
  { href: "/bookings", icon: Ticket, label: "رزروها" },
  { href: "/support", icon: Headphones, label: "پشتیبانی" },
  { href: "/profile", icon: User, label: "پروفایل" },
];

export function BottomNav() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/booking") ||
    pathname.startsWith("/confirmation") ||
    pathname.startsWith("/ticket")
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-border safe-bottom lg:hidden">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all",
                active
                  ? "text-primary-600"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <item.icon
                className={cn("w-5 h-5", active && "stroke-[2.5]")}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-primary-600 mt-[-2px]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
