"use client";

import { Toaster } from "sonner";
import { useThemeStore } from "@/store/theme-store";

export function ThemeToaster() {
  const theme = useThemeStore((s) => s.theme);

  return (
    <Toaster
      position="top-center"
      theme={theme}
      toastOptions={{
        className:
          "!rounded-xl !shadow-lg !border-border !bg-surface !text-text-primary",
      }}
    />
  );
}
