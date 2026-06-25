"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const CATEGORIES = [
  "all",
  "text",
  "security",
  "image",
  "ocr",
  "design",
  "voice",
  "calendar",
  "dev",
  "time",
  "network",
  "daily",
] as const;

export type CategoryId = (typeof CATEGORIES)[number];

export function tagToCategory(tag: string): CategoryId {
  const map: Record<string, CategoryId> = {
    文本: "text",
    安全: "security",
    图像: "image",
    OCR: "ocr",
    设计: "design",
    语音: "voice",
    日历: "calendar",
    开发: "dev",
    时间: "time",
  };
  return map[tag] ?? "all";
}

const CATEGORY_LABEL_KEYS: Record<CategoryId, string> = {
  all: "categoryAll",
  text: "categoryText",
  security: "categorySecurity",
  image: "categoryImage",
  ocr: "categoryOcr",
  design: "categoryDesign",
  voice: "categoryVoice",
  calendar: "categoryCalendar",
  dev: "categoryDev",
  time: "categoryTime",
  network: "categoryNetwork",
  daily: "categoryDaily",
};

interface CategoryFilterProps {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const { t } = useI18n();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          data-active={active === id}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            active === id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {t(CATEGORY_LABEL_KEYS[id] as never)}
        </button>
      ))}
    </div>
  );
}
