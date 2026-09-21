"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Ticket,
  User,
  Plane,
  Headphones,
  Github,
  Linkedin,
} from "lucide-react";
import { cn } from "@/utils/helpers";

const navItems = [
  { href: "/", icon: Home, label: "خانه" },
  { href: "/bookings", icon: Ticket, label: "رزروهای من" },
  { href: "/support", icon: Headphones, label: "پشتیبانی" },
  { href: "/profile", icon: User, label: "پروفایل" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-dvh bg-surface border-l border-border fixed right-0 top-0 z-30">
      <div className="px-6 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-text-primary">تریپیکس</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
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
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-primary-50 text-primary-600"
                  : "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary"
              )}
            >
              <item.icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-border space-y-3">
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/MiladJoodi/Tripix-RTL"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-secondary transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/joodi/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-secondary transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
        <p className="text-xs text-text-muted">تریپیکس نسخه ۱.۰.۰</p>
      </div>
    </aside>
  );
}
