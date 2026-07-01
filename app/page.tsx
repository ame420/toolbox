"use client";

import { useMemo, useState } from "react";
import {
  Languages,
  KeyRound,
  ScanText,
  Palette,
  Volume2,
  CalendarDays,
  Flag,
  FileJson,
  Clock,
  Binary,
  QrCode,
  TextSearch,
  Paintbrush,
  Fingerprint,
  FileDiff,
  Ruler,
  FileText,
  Image,
  Hash,
  Calculator,
  Globe,
  MapPin,
  Weight,
  CalendarRange,
  Link,
  FileDigit,
  ArrowLeftRight,
  BarChart3,
  Timer,
  Dices,
  ShieldCheck,
  CodeXml,
  Contact,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { CategoryFilter, type CategoryId } from "@/components/category-filter";
import { useI18n } from "@/lib/i18n";

interface ToolDef {
  href: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  tags: CategoryId[];
}

const TOOLS: ToolDef[] = [
  {
    href: "/tools/converter",
    icon: Languages,
    titleKey: "converterTitle",
    descKey: "converterDesc",
    tags: ["text"],
  },
  {
    href: "/tools/password",
    icon: KeyRound,
    titleKey: "passwordTitle",
    descKey: "passwordDesc",
    tags: ["security", "daily"],
  },
  {
    href: "/tools/ocr",
    icon: ScanText,
    titleKey: "ocrTitle",
    descKey: "ocrDesc",
    tags: ["image", "ocr"],
  },
  {
    href: "/tools/rgb",
    icon: Palette,
    titleKey: "rgbTitle",
    descKey: "rgbDesc",
    tags: ["image", "design"],
  },
  {
    href: "/tools/tts",
    icon: Volume2,
    titleKey: "ttsTitle",
    descKey: "ttsDesc",
    tags: ["voice", "daily"],
  },
  {
    href: "/tools/calendar-cn",
    icon: CalendarDays,
    titleKey: "calendarCnTitle",
    descKey: "calendarCnDesc",
    tags: ["calendar"],
  },
  {
    href: "/tools/calendar-us",
    icon: Flag,
    titleKey: "calendarUsTitle",
    descKey: "calendarUsDesc",
    tags: ["calendar"],
  },
  {
    href: "/tools/json",
    icon: FileJson,
    titleKey: "jsonTitle",
    descKey: "jsonDesc",
    tags: ["dev"],
  },
  {
    href: "/tools/timestamp",
    icon: Clock,
    titleKey: "timestampTitle",
    descKey: "timestampDesc",
    tags: ["dev", "time"],
  },
  {
    href: "/tools/base64",
    icon: Binary,
    titleKey: "base64Title",
    descKey: "base64Desc",
    tags: ["dev"],
  },
  {
    href: "/tools/qrcode",
    icon: QrCode,
    titleKey: "qrcodeTitle",
    descKey: "qrcodeDesc",
    tags: ["image", "dev"],
  },
  {
    href: "/tools/regex",
    icon: TextSearch,
    titleKey: "regexTitle",
    descKey: "regexDesc",
    tags: ["dev", "text"],
  },
  {
    href: "/tools/color",
    icon: Paintbrush,
    titleKey: "colorTitle",
    descKey: "colorDesc",
    tags: ["design", "dev"],
  },
  {
    href: "/tools/jwt",
    icon: Fingerprint,
    titleKey: "jwtTitle",
    descKey: "jwtDesc",
    tags: ["dev", "security"],
  },
  {
    href: "/tools/diff",
    icon: FileDiff,
    titleKey: "diffTitle",
    descKey: "diffDesc",
    tags: ["dev", "text"],
  },
  {
    href: "/tools/unit",
    icon: Ruler,
    titleKey: "unitTitle",
    descKey: "unitDesc",
    tags: ["daily", "time"],
  },
  {
    href: "/tools/markdown",
    icon: FileText,
    titleKey: "markdownTitle",
    descKey: "markdownDesc",
    tags: ["text", "dev"],
  },
  {
    href: "/tools/compress",
    icon: Image,
    titleKey: "compressTitle",
    descKey: "compressDesc",
    tags: ["image"],
  },
  {
    href: "/tools/hash",
    icon: Hash,
    titleKey: "hashTitle",
    descKey: "hashDesc",
    tags: ["security", "dev"],
  },
  {
    href: "/tools/calculator",
    icon: Calculator,
    titleKey: "calculatorTitle",
    descKey: "calculatorDesc",
    tags: ["daily"],
  },
  {
    href: "/tools/api-request",
    icon: Globe,
    titleKey: "apiTitle",
    descKey: "apiDesc",
    tags: ["dev", "network"],
  },
  {
    href: "/tools/ip-info",
    icon: MapPin,
    titleKey: "ipTitle",
    descKey: "ipDesc",
    tags: ["network"],
  },
  {
    href: "/tools/bmi",
    icon: Weight,
    titleKey: "bmiTitle",
    descKey: "bmiDesc",
    tags: ["daily"],
  },
  {
    href: "/tools/date-calc",
    icon: CalendarRange,
    titleKey: "dateTitle",
    descKey: "dateDesc",
    tags: ["daily", "calendar"],
  },
  {
    href: "/tools/url",
    icon: Link,
    titleKey: "urlTitle",
    descKey: "urlDesc",
    tags: ["dev", "network"],
  },
  {
    href: "/tools/uuid",
    icon: FileDigit,
    titleKey: "uuidTitle",
    descKey: "uuidDesc",
    tags: ["dev", "daily"],
  },
  {
    href: "/tools/base-converter",
    icon: ArrowLeftRight,
    titleKey: "baseConverterTitle",
    descKey: "baseConverterDesc",
    tags: ["dev"],
  },
  {
    href: "/tools/text-stats",
    icon: BarChart3,
    titleKey: "textStatsTitle",
    descKey: "textStatsDesc",
    tags: ["text", "daily"],
  },
  {
    href: "/tools/cron",
    icon: Timer,
    titleKey: "cronTitle",
    descKey: "cronDesc",
    tags: ["dev", "time"],
  },
  {
    href: "/tools/random",
    icon: Dices,
    titleKey: "randomTitle",
    descKey: "randomDesc",
    tags: ["daily"],
  },
  {
    href: "/tools/password-strength",
    icon: ShieldCheck,
    titleKey: "passwordStrengthTitle",
    descKey: "passwordStrengthDesc",
    tags: ["security", "daily"],
  },
  {
    href: "/tools/html-entities",
    icon: CodeXml,
    titleKey: "htmlEntitiesTitle",
    descKey: "htmlEntitiesDesc",
    tags: ["dev", "text"],
  },
  {
    href: "/tools/id-card",
    icon: Contact,
    titleKey: "idCardTitle",
    descKey: "idCardDesc",
    tags: ["daily"],
  },
  {
    href: "/tools/text-transform",
    icon: Type,
    titleKey: "textTransformTitle",
    descKey: "textTransformDesc",
    tags: ["text", "dev"],
  },
];

export default function Home() {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const filteredTools = useMemo(() => {
    if (activeCategory === "all") return TOOLS;
    return TOOLS.filter((tool) =>
      tool.tags.some((tag) => tag === activeCategory)
    );
  }, [activeCategory]);

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("siteTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t("siteSubtitle")}
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </div>

        {filteredTools.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            {t("noTools")}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.href}
                href={tool.href}
                icon={tool.icon}
                title={t(tool.titleKey as never)}
                description={t(tool.descKey as never)}
                tags={tool.tags}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t bg-card py-6">
        <div className="mx-auto max-w-7xl space-y-1 px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>{t("footer")}</p>
          <p>
            {t("busuanziUv")}
            <span id="busuanzi_value_site_uv" className="tabular-nums">…</span>
            {t("busuanziPv")}
            <span id="busuanzi_value_site_pv" className="tabular-nums">…</span>
            {t("busuanziSuffix")}
          </p>
        </div>
      </footer>
    </div>
  );
}
