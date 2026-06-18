/**
 * 中国大陆法定节假日数据。
 * 国务院通常每年年底发布下一年安排，此处维护 2024-2026 年数据。
 * date 格式为 YYYY-MM-DD，type 为 holiday 或 workday（调休补班）。
 */

export type HolidayType = "holiday" | "workday";

export interface HolidayEntry {
  date: string; // YYYY-MM-DD
  name: string;
  type: HolidayType;
}

const RAW_HOLIDAYS: Record<number, HolidayEntry[]> = {
  2024: [
    { date: "2024-01-01", name: "元旦", type: "holiday" },
    { date: "2024-02-09", name: "春节调休上班", type: "workday" },
    { date: "2024-02-10", name: "春节", type: "holiday" },
    { date: "2024-02-11", name: "春节", type: "holiday" },
    { date: "2024-02-12", name: "春节", type: "holiday" },
    { date: "2024-02-13", name: "春节", type: "holiday" },
    { date: "2024-02-14", name: "春节", type: "holiday" },
    { date: "2024-02-15", name: "春节", type: "holiday" },
    { date: "2024-02-16", name: "春节", type: "holiday" },
    { date: "2024-02-17", name: "春节", type: "holiday" },
    { date: "2024-04-04", name: "清明节", type: "holiday" },
    { date: "2024-04-05", name: "清明节", type: "holiday" },
    { date: "2024-04-06", name: "清明节", type: "holiday" },
    { date: "2024-04-07", name: "清明调休上班", type: "workday" },
    { date: "2024-04-28", name: "劳动节调休上班", type: "workday" },
    { date: "2024-05-01", name: "劳动节", type: "holiday" },
    { date: "2024-05-02", name: "劳动节", type: "holiday" },
    { date: "2024-05-03", name: "劳动节", type: "holiday" },
    { date: "2024-05-04", name: "劳动节", type: "holiday" },
    { date: "2024-05-05", name: "劳动节", type: "holiday" },
    { date: "2024-05-11", name: "劳动节调休上班", type: "workday" },
    { date: "2024-06-10", name: "端午节", type: "holiday" },
    { date: "2024-09-14", name: "中秋调休上班", type: "workday" },
    { date: "2024-09-15", name: "中秋节", type: "holiday" },
    { date: "2024-09-16", name: "中秋节", type: "holiday" },
    { date: "2024-09-17", name: "中秋节", type: "holiday" },
    { date: "2024-09-29", name: "国庆调休上班", type: "workday" },
    { date: "2024-10-01", name: "国庆节", type: "holiday" },
    { date: "2024-10-02", name: "国庆节", type: "holiday" },
    { date: "2024-10-03", name: "国庆节", type: "holiday" },
    { date: "2024-10-04", name: "国庆节", type: "holiday" },
    { date: "2024-10-05", name: "国庆节", type: "holiday" },
    { date: "2024-10-06", name: "国庆节", type: "holiday" },
    { date: "2024-10-07", name: "国庆节", type: "holiday" },
    { date: "2024-10-12", name: "国庆调休上班", type: "workday" },
  ],
  2025: [
    { date: "2025-01-01", name: "元旦", type: "holiday" },
    { date: "2025-01-26", name: "春节调休上班", type: "workday" },
    { date: "2025-01-28", name: "春节", type: "holiday" },
    { date: "2025-01-29", name: "春节", type: "holiday" },
    { date: "2025-01-30", name: "春节", type: "holiday" },
    { date: "2025-01-31", name: "春节", type: "holiday" },
    { date: "2025-02-01", name: "春节", type: "holiday" },
    { date: "2025-02-02", name: "春节", type: "holiday" },
    { date: "2025-02-03", name: "春节", type: "holiday" },
    { date: "2025-02-04", name: "春节", type: "holiday" },
    { date: "2025-02-08", name: "春节调休上班", type: "workday" },
    { date: "2025-04-04", name: "清明节", type: "holiday" },
    { date: "2025-04-05", name: "清明节", type: "holiday" },
    { date: "2025-04-06", name: "清明节", type: "holiday" },
    { date: "2025-04-27", name: "劳动节调休上班", type: "workday" },
    { date: "2025-05-01", name: "劳动节", type: "holiday" },
    { date: "2025-05-02", name: "劳动节", type: "holiday" },
    { date: "2025-05-03", name: "劳动节", type: "holiday" },
    { date: "2025-05-04", name: "劳动节", type: "holiday" },
    { date: "2025-05-05", name: "劳动节", type: "holiday" },
    { date: "2025-05-31", name: "端午节", type: "holiday" },
    { date: "2025-06-01", name: "端午节", type: "holiday" },
    { date: "2025-06-02", name: "端午节", type: "holiday" },
    { date: "2025-09-28", name: "国庆调休上班", type: "workday" },
    { date: "2025-10-01", name: "国庆节", type: "holiday" },
    { date: "2025-10-02", name: "国庆节", type: "holiday" },
    { date: "2025-10-03", name: "国庆节", type: "holiday" },
    { date: "2025-10-04", name: "国庆节", type: "holiday" },
    { date: "2025-10-05", name: "国庆节", type: "holiday" },
    { date: "2025-10-06", name: "国庆节", type: "holiday" },
    { date: "2025-10-07", name: "国庆节", type: "holiday" },
    { date: "2025-10-08", name: "国庆节", type: "holiday" },
    { date: "2025-10-11", name: "国庆调休上班", type: "workday" },
  ],
  2026: [
    { date: "2026-01-01", name: "元旦", type: "holiday" },
    { date: "2026-02-17", name: "春节", type: "holiday" },
    { date: "2026-02-18", name: "春节", type: "holiday" },
    { date: "2026-02-19", name: "春节", type: "holiday" },
    { date: "2026-02-20", name: "春节", type: "holiday" },
    { date: "2026-02-21", name: "春节", type: "holiday" },
    { date: "2026-02-22", name: "春节", type: "holiday" },
    { date: "2026-02-23", name: "春节", type: "holiday" },
    { date: "2026-02-24", name: "春节", type: "holiday" },
    { date: "2026-04-04", name: "清明节", type: "holiday" },
    { date: "2026-04-05", name: "清明节", type: "holiday" },
    { date: "2026-04-06", name: "清明节", type: "holiday" },
    { date: "2026-05-01", name: "劳动节", type: "holiday" },
    { date: "2026-05-02", name: "劳动节", type: "holiday" },
    { date: "2026-05-03", name: "劳动节", type: "holiday" },
    { date: "2026-05-04", name: "劳动节", type: "holiday" },
    { date: "2026-05-05", name: "劳动节", type: "holiday" },
    { date: "2026-06-19", name: "端午节", type: "holiday" },
    { date: "2026-06-20", name: "端午节", type: "holiday" },
    { date: "2026-06-21", name: "端午节", type: "holiday" },
    { date: "2026-09-25", name: "中秋节", type: "holiday" },
    { date: "2026-09-26", name: "中秋节", type: "holiday" },
    { date: "2026-09-27", name: "中秋节", type: "holiday" },
    { date: "2026-10-01", name: "国庆节", type: "holiday" },
    { date: "2026-10-02", name: "国庆节", type: "holiday" },
    { date: "2026-10-03", name: "国庆节", type: "holiday" },
    { date: "2026-10-04", name: "国庆节", type: "holiday" },
    { date: "2026-10-05", name: "国庆节", type: "holiday" },
    { date: "2026-10-06", name: "国庆节", type: "holiday" },
    { date: "2026-10-07", name: "国庆节", type: "holiday" },
    { date: "2026-10-08", name: "国庆节", type: "holiday" },
  ],
};

const holidayMap: Record<string, HolidayEntry> = {};
for (const year of Object.keys(RAW_HOLIDAYS)) {
  for (const entry of RAW_HOLIDAYS[Number(year)]) {
    holidayMap[entry.date] = entry;
  }
}

export function getCnHoliday(date: Date): HolidayEntry | undefined {
  const key = date.toISOString().split("T")[0];
  return holidayMap[key];
}

export function getCnHolidaysForYear(year: number): HolidayEntry[] {
  return RAW_HOLIDAYS[year] ?? [];
}

export function getSupportedYears(): number[] {
  return Object.keys(RAW_HOLIDAYS).map(Number).sort();
}
