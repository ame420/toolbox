"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { useI18n } from "@/lib/i18n";

interface City {
  key: string;
  labelKey: string;
  timeZone: string;
}

const CITIES: City[] = [
  { key: "beijing", labelKey: "worldClockCityBeijing", timeZone: "Asia/Shanghai" },
  { key: "tokyo", labelKey: "worldClockCityTokyo", timeZone: "Asia/Tokyo" },
  { key: "sydney", labelKey: "worldClockCitySydney", timeZone: "Australia/Sydney" },
  { key: "dubai", labelKey: "worldClockCityDubai", timeZone: "Asia/Dubai" },
  { key: "moscow", labelKey: "worldClockCityMoscow", timeZone: "Europe/Moscow" },
  { key: "paris", labelKey: "worldClockCityParis", timeZone: "Europe/Paris" },
  { key: "london", labelKey: "worldClockCityLondon", timeZone: "Europe/London" },
  { key: "newYork", labelKey: "worldClockCityNewYork", timeZone: "America/New_York" },
  { key: "losAngeles", labelKey: "worldClockCityLosAngeles", timeZone: "America/Los_Angeles" },
];

function formatTime(date: Date, timeZone: string, lang: string) {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
}

function formatDate(date: Date, timeZone: string, lang: string) {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
    timeZone,
  }).format(date);
}

function getOffset(date: Date, timeZone: string) {
  const timeString = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "shortOffset",
    timeZone,
    hour12: false,
  }).format(date);
  const parts = timeString.split(" ");
  return parts[parts.length - 1] ?? "";
}

export default function WorldClockPage() {
  const { lang, t } = useI18n();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const initialTimer = setTimeout(update, 0);
    const timer = setInterval(update, 1000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("worldClockTitle")} description={t("worldClockDesc")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CITIES.map((city) => (
          <div
            key={city.key}
            className="flex flex-col rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{t(city.labelKey as never)}</p>
              <p className="text-xs text-muted-foreground">{getOffset(now ?? new Date(), city.timeZone)}</p>
            </div>
            <p className="mt-2 text-3xl font-bold tabular-nums">
              {now ? formatTime(now, city.timeZone, lang) : "--:--:--"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {now ? formatDate(now, city.timeZone, lang) : "---"}
            </p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
