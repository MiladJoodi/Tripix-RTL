"use client";

import { motion } from "framer-motion";
import { Bus, Train, Plane } from "lucide-react";
import { Ticket, TransportType } from "@/types";
import { formatTime, formatDuration, formatPrice, cn, toPersianDigits } from "@/utils/helpers";

const typeIcon: Record<TransportType, React.ReactNode> = {
  bus: <Bus className="w-3.5 h-3.5" />,
  train: <Train className="w-3.5 h-3.5" />,
  flight: <Plane className="w-3.5 h-3.5" />,
};

const typeColor: Record<TransportType, string> = {
  bus: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  train: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  flight: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
};

interface TicketCardProps {
  ticket: Ticket;
  index?: number;
  onClick?: () => void;
}

export function TicketCard({ ticket, index = 0, onClick }: TicketCardProps) {
  const stopsLabel =
    ticket.stops.length === 0
      ? "مستقیم"
      : `${toPersianDigits(ticket.stops.length)} توقف`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.25 }}
      onClick={onClick}
      className="bg-surface rounded-2xl px-3.5 py-3 sm:p-4 shadow-sm border border-border active:scale-[0.98] transition-transform cursor-pointer hover:shadow-md"
    >
      {/* Provider + Type badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base sm:text-lg shrink-0">{ticket.provider.logo}</span>
          <span className="text-xs sm:text-sm font-medium text-text-secondary truncate">
            {ticket.provider.name}
          </span>
        </div>
        <span
          className={cn(
            "flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shrink-0",
            typeColor[ticket.type]
          )}
        >
          {typeIcon[ticket.type]}
          {ticket.class}
        </span>
      </div>

      {/* Route times */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg sm:text-xl font-bold text-text-primary tabular-nums">
            {formatTime(ticket.departureTime)}
          </p>
          <p className="text-[11px] sm:text-xs text-text-secondary">{ticket.origin.code}</p>
        </div>

        <div className="flex-1 mx-3 sm:mx-4 flex flex-col items-center min-w-0">
          <span className="text-[10px] sm:text-xs text-text-muted mb-0.5 sm:mb-1">
            {formatDuration(ticket.duration)}
          </span>
          <div className="w-full relative flex items-center">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-border" />
            <div className="flex-1 h-px bg-border mx-1 relative">
              {ticket.stops.map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"
                  style={{
                    left: `${((i + 1) / (ticket.stops.length + 1)) * 100}%`,
                  }}
                />
              ))}
            </div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-border" />
          </div>
          <span
            className={cn(
              "text-[10px] sm:text-xs mt-0.5 sm:mt-1",
              ticket.stops.length === 0 ? "text-emerald-600" : "text-amber-600"
            )}
          >
            {stopsLabel}
          </span>
        </div>

        <div className="text-left">
          <p className="text-lg sm:text-xl font-bold text-text-primary tabular-nums">
            {formatTime(ticket.arrivalTime)}
          </p>
          <p className="text-[11px] sm:text-xs text-text-secondary">{ticket.destination.code}</p>
        </div>
      </div>

      {/* Bottom: seats + price only (amenities on detail page) */}
      <div className="flex items-center justify-between mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-border">
        <span className="text-[11px] sm:text-xs text-text-muted">
          {toPersianDigits(ticket.seatsAvailable)} صندلی
        </span>
        <span className="text-base sm:text-xl font-bold text-primary-600 tabular-nums">
          {formatPrice(ticket.price)}
        </span>
      </div>
    </motion.div>
  );
}
