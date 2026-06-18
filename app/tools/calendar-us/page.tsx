"use client";

import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { CalendarView } from "@/components/calendar-view";
import { getUsHoliday } from "@/lib/holidays-us";
import { useI18n } from "@/lib/i18n";

export default function CalendarUsPage() {
  const { t } = useI18n();

  return (
    <ToolLayout maxWidth="max-w-6xl">
      <PageHeader
        title={t("calendarUsTitle")}
        description={t("calendarUsDesc")}
      />
      <CalendarView
        getHoliday={getUsHoliday}
        weekDays={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
      />
    </ToolLayout>
  );
}
