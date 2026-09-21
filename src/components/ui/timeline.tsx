"use client";

import { MapPin, Clock } from "lucide-react";
import { formatTime, formatDuration, toPersianDigits } from "@/utils/helpers";
import { Stop, City } from "@/types";

interface TimelineProps {
  origin: City;
  destination: City;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: Stop[];
}

export function Timeline({
  origin,
  destination,
  departureTime,
  arrivalTime,
  duration,
  stops,
}: TimelineProps) {
  return (
    <div className="relative pr-8">
      {/* Vertical line */}
      <div className="absolute right-[11px] top-2 bottom-2 w-0.5 bg-border" />

      {/* Departure */}
      <div className="relative pb-6">
        <div className="absolute right-[-21px] top-1 w-3 h-3 rounded-full bg-primary-600 ring-4 ring-primary-100" />
        <div className="flex items-start justify-between">
          <span className="text-lg font-bold text-text-primary">
            {formatTime(departureTime)}
          </span>
          <div>
            <p className="font-semibold text-text-primary">{origin.name}</p>
            <p className="text-xs text-text-secondary">{origin.code}</p>
          </div>
        </div>
      </div>

      {/* Stops */}
      {stops.map((stop, i) => (
        <div key={i} className="relative pb-6">
          <div className="absolute right-[-19px] top-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-100" />
          <div className="flex items-start justify-between">
            <p className="text-sm text-text-secondary">
              {formatTime(stop.arrivalTime)} - {formatTime(stop.departureTime)}
            </p>
            <div>
              <p className="text-sm font-medium text-text-secondary">
                {stop.city.name}
              </p>
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <Clock className="w-3 h-3" />
                <span>{toPersianDigits(stop.duration)} دقیقه توقف</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Duration indicator */}
      {stops.length === 0 && (
        <div className="relative pb-6">
          <div className="absolute right-[-18px] top-1">
            <Clock className="w-[10px] h-[10px] text-text-muted" />
          </div>
          <p className="text-xs text-text-muted">{formatDuration(duration)}</p>
        </div>
      )}

      {/* Arrival */}
      <div className="relative">
        <div className="absolute right-[-21px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
        <div className="flex items-start justify-between">
          <span className="text-lg font-bold text-text-primary">
            {formatTime(arrivalTime)}
          </span>
          <div>
            <p className="font-semibold text-text-primary">{destination.name}</p>
            <p className="text-xs text-text-secondary">{destination.code}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
