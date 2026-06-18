"use client";

import { useCallback } from "react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { CalendarView } from "@/components/calendar-view";
import { getCnHoliday } from "@/lib/holidays-cn";
import { Solar } from "lunar-javascript";
import { useI18n } from "@/lib/i18n";

export default function CalendarCnPage() {
  const { t } = useI18n();

  const getLunar = useCallback((date: Date) => {
    try {
      const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
      const lunar = solar.getLunar();
      const dayName = lunar.getDayInChinese();
      return dayName === "初一" ? lunar.getMonthInChinese() + "月" : dayName;
    } catch {
      return "";
    }
  }, []);

  return (
    <ToolLayout maxWidth="max-w-6xl">
      <PageHeader
        title={t("calendarCnTitle")}
        description={t("calendarCnDesc")}
      />
      <CalendarView getHoliday={getCnHoliday} getLunar={getLunar} />
    </ToolLayout>
  );
}
