"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function diffDays(a: Date, b: Date): number {
  const ta = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const tb = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((tb.getTime() - ta.getTime()) / 86400000);
}

export default function DateCalcPage() {
  const { t } = useI18n();
  const today = toLocalDateStr(new Date());

  const [d1, setD1] = useState(today);
  const [d2, setD2] = useState(today);
  const [baseDate, setBaseDate] = useState(today);
  const [offset, setOffset] = useState("");
  const [offsetResult, setOffsetResult] = useState<string | null>(null);

  const diff = d1 && d2 ? diffDays(new Date(d1), new Date(d2)) : null;

  const calcOffset = () => {
    const n = parseInt(offset, 10);
    if (isNaN(n) || !baseDate) return;
    const d = new Date(baseDate);
    d.setDate(d.getDate() + n);
    setOffsetResult(toLocalDateStr(d));
  };

  const offsetDir = offset.startsWith("-") || (offset && parseInt(offset) < 0) ? "before" : "after";

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader
        title={t("dateTitle")}
        description={t("dateDesc")}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-medium">{t("dateDiff")}</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">{t("dateStart")}</Label>
              <Input
                type="date"
                value={d1}
                onChange={(e) => setD1(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t("dateEnd")}</Label>
              <Input
                type="date"
                value={d2}
                onChange={(e) => setD2(e.target.value)}
              />
            </div>
            {diff !== null && (
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-xs text-muted-foreground">{t("dateDiffResult")}</p>
                <p className="text-2xl font-bold">
                  {Math.abs(diff)} {t("dateDays")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {diff === 0
                    ? t("dateSameDay")
                    : diff > 0
                    ? t("dateD2After")
                    : t("dateD2Before")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-medium">{t("dateArithmetic")}</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">{t("dateBase")}</Label>
              <Input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">{t("dateOffset")}</Label>
                <Input
                  type="number"
                  value={offset}
                  onChange={(e) => setOffset(e.target.value)}
                  onBlur={calcOffset}
                  onKeyDown={(e) => e.key === "Enter" && calcOffset()}
                  placeholder={t("dateOffsetPlaceholder")}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={calcOffset}
                  className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {t("dateCalc")}
                </button>
              </div>
            </div>
            {offsetResult && (
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  {baseDate} {offsetDir === "after" ? "+" : ""}{offset} {t("dateDays")} =
                </p>
                <p className="text-xl font-bold">{offsetResult}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
