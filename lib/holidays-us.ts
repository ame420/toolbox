/**
 * 美国法定节假日计算。
 * 包含固定日期节日与浮动星期一节日。
 */

export interface HolidayEntry {
  date: string; // YYYY-MM-DD
  name: string;
  type: "holiday";
}

function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
  // month: 0-based, weekday: 0=Sunday
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  let day = 1 + ((weekday - firstWeekday + 7) % 7);
  day += (n - 1) * 7;
  return new Date(year, month, day);
}

function lastWeekday(year: number, month: number, weekday: number): Date {
  const lastDay = new Date(year, month + 1, 0);
  const lastWeekday = lastDay.getDay();
  const diff = (lastWeekday - weekday + 7) % 7;
  return new Date(year, month, lastDay.getDate() - diff);
}

export function getUsHolidaysForYear(year: number): HolidayEntry[] {
  const holidays: HolidayEntry[] = [
    { date: `${year}-01-01`, name: "New Year's Day", type: "holiday" },
    {
      date: nthWeekday(year, 0, 1, 3).toISOString().split("T")[0],
      name: "Martin Luther King Jr. Day",
      type: "holiday",
    },
    {
      date: nthWeekday(year, 1, 1, 3).toISOString().split("T")[0],
      name: "Presidents' Day",
      type: "holiday",
    },
    {
      date: lastWeekday(year, 4, 1).toISOString().split("T")[0],
      name: "Memorial Day",
      type: "holiday",
    },
    { date: `${year}-06-19`, name: "Juneteenth", type: "holiday" },
    { date: `${year}-07-04`, name: "Independence Day", type: "holiday" },
    {
      date: nthWeekday(year, 8, 1, 1).toISOString().split("T")[0],
      name: "Labor Day",
      type: "holiday",
    },
    {
      date: nthWeekday(year, 9, 1, 2).toISOString().split("T")[0],
      name: "Columbus Day",
      type: "holiday",
    },
    { date: `${year}-11-11`, name: "Veterans Day", type: "holiday" },
    {
      date: nthWeekday(year, 10, 4, 4).toISOString().split("T")[0],
      name: "Thanksgiving Day",
      type: "holiday",
    },
    { date: `${year}-12-25`, name: "Christmas Day", type: "holiday" },
  ];

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

export function getUsHoliday(date: Date): HolidayEntry | undefined {
  const year = date.getFullYear();
  const key = date.toISOString().split("T")[0];
  return getUsHolidaysForYear(year).find((h) => h.date === key);
}
