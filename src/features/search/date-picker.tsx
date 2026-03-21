"use client";

import { Calendar } from "lucide-react";
import DatePickerComponent from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  function handleChange(dateObj: any) {
    if (!dateObj) return;
    const g = dateObj.toDate();
    const iso = g.toISOString().split("T")[0];
    onChange(iso);
  }

  return (
    <div>
      <label className="text-xs font-medium text-text-secondary mb-1 block">
        تاریخ حرکت
      </label>
      <div className="relative">
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
        <DatePickerComponent
          calendar={persian}
          locale={persian_fa}
          value={value ? new Date(value) : new Date()}
          onChange={handleChange}
          minDate={new Date()}
          format="YYYY/MM/DD"
          calendarPosition="bottom-right"
          inputClass="w-full pr-10 pl-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-text-primary outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
          containerClassName="w-full"
        />
      </div>
    </div>
  );
}
