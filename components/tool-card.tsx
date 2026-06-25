"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { type CategoryId } from "./category-filter";

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

export interface ToolCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tags?: CategoryId[];
}

export function ToolCard({ href, icon: Icon, title, description, tags }: ToolCardProps) {
  const { t } = useI18n();

  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
          {tags && tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                >
                  {t(CATEGORY_LABEL_KEYS[tag] as never)}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
