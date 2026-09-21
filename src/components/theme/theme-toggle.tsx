"use client";

import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/store/theme-store";
import { cn } from "@/utils/helpers";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  if (showLabel) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface-tertiary text-sm font-medium text-text-secondary transition-colors",
          className
        )}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-primary-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
        {isDark ? "تاریک" : "روشن"}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      aria-label={isDark ? "حالت روشن" : "حالت تاریک"}
      title={isDark ? "حالت روشن" : "حالت تاریک"}
      className={cn(
        "p-2 rounded-xl border border-border bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -40, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 40, scale: 0.7 }}
          transition={{ duration: 0.15 }}
          className="block"
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-primary-400" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
