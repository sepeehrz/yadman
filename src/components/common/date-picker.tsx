"use client";

import { cn } from "@/lib";
import dayjs from "@/lib/day";
import React, { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import DateObject from "react-date-object";
import { AppIcon } from "@/components/ui/app-icon";
import { Input } from "@/components/ui/input";
import DatePicker, { type DatePickerRef } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

type Props = {
  id?: string;
  value?: string | null | number;
  onChange?: (value: string | null) => void;
  format?: string;
  displayFormat?: string;
  placeholder?: string;
  minDate?: DateObject;
  maxDate?: DateObject;
  clearable?: boolean;
  className?: string;
};

export const DatePickerComponent: React.FC<Props> = ({
  id,
  value,
  onChange,
  format = "YYYY-MM-DD",
  displayFormat = "YYYY/MM/DD",
  minDate,
  maxDate,
  placeholder,
  className,
  clearable = true,
}) => {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const pickerRef = useRef<DatePickerRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleDocumentPointerDown(event: MouseEvent | TouchEvent): void {
      const container = containerRef.current;
      if (!container) {
        return;
      }
      const target = event.target instanceof Node ? event.target : null;
      if (target && !container.contains(target)) {
        pickerRef.current?.closeCalendar();
      }
    }

    document.addEventListener("mousedown", handleDocumentPointerDown, true);
    document.addEventListener("touchstart", handleDocumentPointerDown, true);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleDocumentPointerDown,
        true,
      );
      document.removeEventListener(
        "touchstart",
        handleDocumentPointerDown,
        true,
      );
    };
  }, []);

  const pickerValue = useMemo(() => {
    if (!value) return null;

    const strictParsed = dayjs(String(value), format, true);
    const parsed = strictParsed.isValid() ? strictParsed : dayjs(value);

    if (!parsed.isValid()) return null;

    return new DateObject({
      date: parsed.toDate(),
      calendar: persian,
      locale: persian_fa,
    });
  }, [value, format]);

  function handleChange(date: DateObject | DateObject[] | null) {
    if (!date || Array.isArray(date)) {
      onChange?.(null);
      return;
    }

    const serverValue = dayjs(date.toDate()).format(format);

    onChange?.(serverValue);
  }

  return (
    <div ref={containerRef} className="w-full">
      <DatePicker
        ref={pickerRef}
        containerClassName="w-full"
        className={cn("w-full", isDark && "bg-dark")}
        value={pickerValue}
        onChange={handleChange}
        calendar={persian}
        locale={persian_fa}
        format={displayFormat}
        minDate={minDate}
        maxDate={maxDate}
        render={(inputValue, openCalendar) => (
          <div className="relative w-full">
            <Input
              id={id}
              readOnly
              value={inputValue}
              placeholder={placeholder}
              onClick={openCalendar}
              className={cn("bg-background w-full cursor-pointer", className)}
            />
            {clearable && pickerValue ? (
              <button
                type="button"
                aria-label="پاک کردن تاریخ"
                onClick={() => onChange?.(null)}
                className="absolute left-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary/5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              >
                <AppIcon name="close" className="size-3.5" />
              </button>
            ) : null}
          </div>
        )}
      />
    </div>
  );
};
