"use client";

import { Calendar } from "lucide-react";
import DatePickerComponent from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { cn } from "@/utils/helpers";

interface BirthDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  label?: string;
}

export function BirthDatePicker({
  value,
  onChange,
  error,
  label = "تاریخ تولد",
}: BirthDatePickerProps) {
  function handleChange(dateObj: any) {
    if (!dateObj) {
      onChange("");
      return;
    }
    const g = dateObj.toDate();
    const iso = g.toISOString().split("T")[0];
    onChange(iso);
  }

  return (
    <div>
      <label className="text-xs font-medium text-text-secondary mb-1 block">
        {label}
      </label>
      <div className="relative">
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none z-10" />
        <DatePickerComponent
          calendar={persian}
          locale={persian_fa}
          value={value ? new Date(value) : undefined}
          onChange={handleChange}
          maxDate={new Date()}
          format="YYYY/MM/DD"
          calendarPosition="bottom-right"
          placeholder="انتخاب تاریخ"
          inputClass={cn(
            "w-full pr-10 pl-3 py-2.5 rounded-xl border text-sm outline-none transition-all",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          )}
          containerClassName="w-full"
        />
      </div>
    </div>
  );
}
