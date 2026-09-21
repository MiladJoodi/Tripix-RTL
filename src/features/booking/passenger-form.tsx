"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Passenger } from "@/types";
import { cn, toPersianDigits } from "@/utils/helpers";
import { BirthDatePicker } from "./birth-date-picker";

function buildSchema(showContact: boolean) {
  return z
    .object({
      firstName: z.string().min(2, "نام الزامی است"),
      lastName: z.string().min(2, "نام خانوادگی الزامی است"),
      email: z.string(),
      phone: z.string(),
      dateOfBirth: z.string().min(1, "تاریخ تولد الزامی است"),
      idNumber: z
        .string()
        .min(10, "کد ملی باید ۱۰ رقم باشد")
        .max(10, "کد ملی باید ۱۰ رقم باشد"),
    })
    .superRefine((data, ctx) => {
      if (!showContact) return;
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "ایمیل نامعتبر است",
        });
      }
      if (!data.phone || data.phone.length < 10) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "شماره موبایل الزامی است",
        });
      }
    });
}

interface PassengerFormProps {
  index: number;
  onSubmit: (data: Passenger) => void;
  defaultValues?: Passenger;
  /** Contact fields only on first passenger */
  showContact?: boolean;
}

const inputBase =
  "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all";

export function PassengerForm({
  index,
  onSubmit,
  defaultValues,
  showContact = false,
}: PassengerFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Passenger>({
    resolver: zodResolver(buildSchema(showContact)),
    defaultValues: defaultValues || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      idNumber: "",
    },
  });

  function fieldClass(hasError: boolean) {
    return cn(
      inputBase,
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onSubmit={handleSubmit(onSubmit)}
      id={`passenger-form-${index}`}
      className="bg-surface rounded-2xl p-4 shadow-sm border border-border space-y-3"
    >
      <h3 className="text-sm font-semibold text-text-primary">
        مسافر {toPersianDigits(index + 1)}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1 block">
            نام
          </label>
          <input
            {...register("firstName")}
            autoComplete="given-name"
            className={fieldClass(!!errors.firstName)}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1 block">
            نام خانوادگی
          </label>
          <input
            {...register("lastName")}
            autoComplete="family-name"
            className={fieldClass(!!errors.lastName)}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <div>
              <BirthDatePicker
                value={field.value}
                onChange={field.onChange}
                error={!!errors.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          )}
        />
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1 block">
            کد ملی
          </label>
          <input
            {...register("idNumber")}
            inputMode="numeric"
            maxLength={10}
            className={fieldClass(!!errors.idNumber)}
          />
          {errors.idNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.idNumber.message}</p>
          )}
        </div>
      </div>

      {showContact && (
        <div className="pt-1 space-y-3 border-t border-border">
          <p className="text-xs font-medium text-text-muted pt-2">
            اطلاعات تماس (برای ارسال بلیط)
          </p>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">
              شماره موبایل
            </label>
            <input
              {...register("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              className={fieldClass(!!errors.phone)}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">
              ایمیل
            </label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              className={fieldClass(!!errors.email)}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
      )}
    </motion.form>
  );
}
