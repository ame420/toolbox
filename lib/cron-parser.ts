/** 轻量级 Cron 表达式解析器（标准 5 字段：分 时 日 月 周） */

export interface CronField {
  name: string;
  min: number;
  max: number;
  values: number[];
}

export interface CronParseResult {
  valid: boolean;
  error?: string;
  fields?: CronField[];
  nextExecutions?: Date[];
}

const FIELD_NAMES = ["minute", "hour", "day", "month", "weekday"] as const;
const FIELD_RANGES: Record<(typeof FIELD_NAMES)[number], { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  day: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  weekday: { min: 0, max: 6 },
};

function parseField(value: string, name: (typeof FIELD_NAMES)[number]): number[] | null {
  const { min, max } = FIELD_RANGES[name];
  const parts = value.split(",");
  const result = new Set<number>();

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed === "*") {
      for (let i = min; i <= max; i += 1) result.add(i);
      continue;
    }

    // Step: */n or a-b/n
    const stepMatch = trimmed.match(/^(.+)\/(\d+)$/);
    const step = stepMatch ? Number(stepMatch[2]) : 1;
    const rangePart = stepMatch ? stepMatch[1] : trimmed;

    if (rangePart === "*") {
      for (let i = min; i <= max; i += step) result.add(i);
    } else if (rangePart.includes("-")) {
      const [startStr, endStr] = rangePart.split("-");
      const start = Number(startStr);
      const end = Number(endStr);
      if (Number.isNaN(start) || Number.isNaN(end) || start < min || end > max || start > end) return null;
      for (let i = start; i <= end; i += step) result.add(i);
    } else {
      const num = Number(rangePart);
      if (Number.isNaN(num) || num < min || num > max) return null;
      result.add(num);
    }
  }

  return Array.from(result).sort((a, b) => a - b);
}

function fieldMatches(value: number, values: number[]): boolean {
  return values.includes(value);
}

export function parseCron(expression: string, count = 5): CronParseResult {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { valid: false, error: "invalid" };
  }

  const fields: CronField[] = [];
  for (let i = 0; i < 5; i += 1) {
    const name = FIELD_NAMES[i];
    const values = parseField(parts[i], name);
    if (!values || values.length === 0) {
      return { valid: false, error: "invalid" };
    }
    fields.push({ name, ...FIELD_RANGES[name], values });
  }

  const nextExecutions: Date[] = [];
  const start = new Date();
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);

  const maxDate = new Date(start);
  maxDate.setFullYear(maxDate.getFullYear() + 2);

  const current = new Date(start);
  while (nextExecutions.length < count && current <= maxDate) {
    const month = current.getMonth() + 1;
    const day = current.getDate();
    const hour = current.getHours();
    const minute = current.getMinutes();
    const weekday = current.getDay();

    const [minuteField, hourField, dayField, monthField, weekdayField] = fields;

    if (
      fieldMatches(minute, minuteField.values) &&
      fieldMatches(hour, hourField.values) &&
      fieldMatches(month, monthField.values) &&
      (fieldMatches(day, dayField.values) || fieldMatches(weekday, weekdayField.values))
    ) {
      nextExecutions.push(new Date(current));
    }

    current.setMinutes(current.getMinutes() + 1);
  }

  return {
    valid: true,
    fields,
    nextExecutions,
  };
}

export function explainCron(expression: string, t: (key: string) => string): string {
  const result = parseCron(expression, 0);
  if (!result.valid) return t("cronInvalid");

  const parts = expression.trim().split(/\s+/);
  const lines = [
    `${t("cronFieldMinute")}: ${parts[0]}`,
    `${t("cronFieldHour")}: ${parts[1]}`,
    `${t("cronFieldDay")}: ${parts[2]}`,
    `${t("cronFieldMonth")}: ${parts[3]}`,
    `${t("cronFieldWeek")}: ${parts[4]}`,
  ];
  return lines.join("\n");
}
