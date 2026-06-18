"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export interface HolidayEntry {
  date: string;
  name: string;
  type?: "holiday" | "workday";
}

export interface CalendarViewProps {
  /** 根据日期返回节日信息 */
  getHoliday: (date: Date) => HolidayEntry | undefined;
  /** 根据日期返回农历显示文本，可选 */
  getLunar?: (date: Date) => string;
  /** 星期标题 */
  weekDays?: string[];
  /** 月初第一天是否从周日开始 */
  startFromSunday?: boolean;
}

export function CalendarView({
  getHoliday,
  getLunar,
  weekDays,
  startFromSunday = true,
}: CalendarViewProps) {
  const { t, lang } = useI18n();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const today = useMemo(() => new Date(), []);
  const todayKey = today.toISOString().split("T")[0];

  const displayWeekDays = useMemo(() => {
    if (weekDays) return weekDays;
    return t("weekDays").split(",");
  }, [weekDays, t]);

  const monthNames = useMemo(() => t("monthNames").split(","), [t]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDayOfMonth.getDay();

    const days: {
      date: Date;
      day: number;
      currentMonth: boolean;
      key: string;
      holiday?: HolidayEntry;
      lunar?: string;
    }[] = [];

    // previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    const offset = startFromSunday ? startOffset : (startOffset + 6) % 7;
    for (let i = offset - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date: d,
        day: prevMonthDays - i,
        currentMonth: false,
        key: d.toISOString().split("T")[0],
        holiday: getHoliday(d),
        lunar: getLunar?.(d),
      });
    }

    // current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        day: i,
        currentMonth: true,
        key: d.toISOString().split("T")[0],
        holiday: getHoliday(d),
        lunar: getLunar?.(d),
      });
    }

    // next month padding to fill 6 rows
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        day: i,
        currentMonth: false,
        key: d.toISOString().split("T")[0],
        holiday: getHoliday(d),
        lunar: getLunar?.(d),
      });
    }

    return days;
  }, [year, month, getHoliday, getLunar, startFromSunday]);

  const goPrev = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="min-w-[140px] text-center text-xl font-bold">
            {year} {lang === "zh" ? "年" : ""} {monthNames[month]}
          </h2>
          <Button variant="outline" size="icon" onClick={goNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="secondary" onClick={goToday}>
          {t("calendarToday")}
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 rounded-lg border bg-card p-2 sm:gap-2 sm:p-3">
        {displayWeekDays.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-sm font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
        {calendarDays.map((day) => {
          const isToday = day.key === todayKey;
          const isHoliday = day.holiday?.type === "holiday";
          const isWorkday = day.holiday?.type === "workday";
          const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;

          return (
            <div
              key={day.key}
              className={cn(
                "relative flex h-[72px] flex-col items-center justify-center overflow-hidden rounded-md border p-1 sm:h-[88px] md:h-[104px] sm:p-2",
                day.currentMonth ? "bg-background" : "bg-muted/50 text-muted-foreground",
                isToday && "border-primary ring-1 ring-primary",
                isHoliday && "bg-red-50 dark:bg-red-950/20",
                isWorkday && "bg-blue-50 dark:bg-blue-950/20"
              )}
            >
              <span
                className={cn(
                  "text-sm font-semibold sm:text-base",
                  isWeekend ? "text-red-500" : ""
                )}
              >
                {day.day}
              </span>
              {day.lunar && (
                <span className="line-clamp-1 w-full text-center text-[10px] text-muted-foreground sm:text-xs">
                  {day.lunar}
                </span>
              )}
              {day.holiday && (
                <span
                  className={cn(
                    "line-clamp-1 w-full text-center text-[10px] font-medium sm:text-xs",
                    isHoliday ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"
                  )}
                >
                  {day.holiday.name}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span>{t("calendarHoliday")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500" />
          <span>{t("calendarWorkday")}</span>
        </div>
      </div>
    </div>
  );
}
