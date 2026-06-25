"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";

function calcBmi(weight: number, height: number): number {
  if (height <= 0 || weight <= 0) return 0;
  const h = height / 100;
  return weight / (h * h);
}

function getCategory(bmi: number): { label: string; color: string; range: string } {
  if (bmi < 18.5) return { label: "bmiUnderweight", color: "text-blue-500", range: "< 18.5" };
  if (bmi < 25) return { label: "bmiNormal", color: "text-green-500", range: "18.5 - 24.9" };
  if (bmi < 30) return { label: "bmiOverweight", color: "text-yellow-500", range: "25 - 29.9" };
  if (bmi < 35) return { label: "bmiObese1", color: "text-orange-500", range: "30 - 34.9" };
  if (bmi < 40) return { label: "bmiObese2", color: "text-red-500", range: "35 - 39.9" };
  return { label: "bmiObese3", color: "text-red-600", range: "≥ 40" };
}

export default function BmiPage() {
  const { t } = useI18n();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const h = parseFloat(height);
  const w = parseFloat(weight);
  const bmi = h > 0 && w > 0 ? calcBmi(w, h) : null;
  const category = bmi ? getCategory(bmi) : null;

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader
        title={t("bmiTitle")}
        description={t("bmiDesc")}
      />

      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("bmiHeight")}</label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={t("bmiHeightPlaceholder")}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                cm
              </span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">{t("bmiWeight")}</label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={t("bmiWeightPlaceholder")}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                kg
              </span>
            </div>
          </div>
        </div>

        {bmi !== null && (
          <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
            <p className="mb-1 text-sm text-muted-foreground">{t("bmiResult")}</p>
            <p className="text-5xl font-bold tracking-tight">{bmi.toFixed(1)}</p>
            {category && (
              <p className={`mt-2 text-lg font-medium ${category.color}`}>
                {t(category.label as never)}
                <span className="ml-2 text-sm text-muted-foreground">
                  {category.range}
                </span>
              </p>
            )}
          </div>
        )}

        <div className="rounded-lg border bg-card p-4 text-xs text-muted-foreground">
          <p className="mb-2 font-medium">{t("bmiReference")}</p>
          <div className="space-y-1">
            {[
              ["bmiUnderweight", "< 18.5", "text-blue-500"],
              ["bmiNormal", "18.5 - 24.9", "text-green-500"],
              ["bmiOverweight", "25 - 29.9", "text-yellow-500"],
              ["bmiObese1", "30 - 34.9", "text-orange-500"],
              ["bmiObese2", "35 - 39.9", "text-red-500"],
              ["bmiObese3", "≥ 40", "text-red-600"],
            ].map(([key, range, color]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${color.replace("text", "bg").replace(/-5[0-9]{2}/, "500")}`} />
                <span>{t(key as never)}</span>
                <span className="ml-auto">{range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
