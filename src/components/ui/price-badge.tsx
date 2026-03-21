"use client";

import { formatPrice } from "@/utils/helpers";
import { cn } from "@/utils/helpers";

interface PriceBadgeProps {
  price: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "highlight";
}

export function PriceBadge({
  price,
  size = "md",
  variant = "default",
}: PriceBadgeProps) {
  return (
    <span
      className={cn(
        "font-bold",
        size === "sm" && "text-sm",
        size === "md" && "text-lg",
        size === "lg" && "text-2xl",
        variant === "default" && "text-primary-600",
        variant === "highlight" &&
          "text-primary-600 bg-primary-50 px-3 py-1 rounded-full"
      )}
    >
      {formatPrice(price)}
    </span>
  );
}
