"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, Copy, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

type CategoryId = "length" | "weight" | "temperature" | "data" | "area" | "volume";

interface UnitDef {
  id: string;
  key: string;
  factor: number;
}

interface CategoryDef {
  id: CategoryId;
  units: UnitDef[];
}

const CATEGORIES: CategoryDef[] = [
  {
    id: "length",
    units: [
      { id: "m", key: "unitMeter", factor: 1 },
      { id: "km", key: "unitKilometer", factor: 1000 },
      { id: "cm", key: "unitCentimeter", factor: 0.01 },
      { id: "mm", key: "unitMillimeter", factor: 0.001 },
      { id: "in", key: "unitInch", factor: 0.0254 },
      { id: "ft", key: "unitFoot", factor: 0.3048 },
      { id: "yd", key: "unitYard", factor: 0.9144 },
      { id: "mi", key: "unitMile", factor: 1609.344 },
    ],
  },
  {
    id: "weight",
    units: [
      { id: "g", key: "unitGram", factor: 1 },
      { id: "kg", key: "unitKilogram", factor: 1000 },
      { id: "mg", key: "unitMilligram", factor: 0.001 },
      { id: "lb", key: "unitPound", factor: 453.59237 },
      { id: "oz", key: "unitOunce", factor: 28.34952 },
    ],
  },
  {
    id: "temperature",
    units: [
      { id: "c", key: "unitCelsius", factor: 1 },
      { id: "f", key: "unitFahrenheit", factor: 1 },
      { id: "k", key: "unitKelvin", factor: 1 },
    ],
  },
  {
    id: "data",
    units: [
      { id: "b", key: "unitByte", factor: 1 },
      { id: "kb", key: "unitKilobyte", factor: 1024 },
      { id: "mb", key: "unitMegabyte", factor: 1024 * 1024 },
      { id: "gb", key: "unitGigabyte", factor: 1024 * 1024 * 1024 },
      { id: "tb", key: "unitTerabyte", factor: 1024 * 1024 * 1024 * 1024 },
    ],
  },
  {
    id: "area",
    units: [
      { id: "m2", key: "unitSquareMeter", factor: 1 },
      { id: "km2", key: "unitSquareKilometer", factor: 1_000_000 },
      { id: "ft2", key: "unitSquareFoot", factor: 0.092903 },
      { id: "ac", key: "unitAcre", factor: 4046.85642 },
    ],
  },
  {
    id: "volume",
    units: [
      { id: "l", key: "unitLiter", factor: 1 },
      { id: "ml", key: "unitMilliliter", factor: 0.001 },
      { id: "gal", key: "unitGallon", factor: 3.78541 },
      { id: "cup", key: "unitCup", factor: 0.24 },
    ],
  },
];

function convertTemperature(value: number, from: string, to: string): number {
  let celsius = value;
  if (from === "f") celsius = (value - 32) * (5 / 9);
  else if (from === "k") celsius = value - 273.15;

  if (to === "c") return celsius;
  if (to === "f") return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (Number.isInteger(n)) return n.toString();
  return parseFloat(n.toPrecision(6)).toString();
}

export default function UnitPage() {
  const { t } = useI18n();
  const [category, setCategory] = useState<CategoryId>("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("km");
  const [value, setValue] = useState<string>("1");

  const currentCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0],
    [category]
  );

  const result = useMemo(() => {
    const num = Number.parseFloat(value);
    if (Number.isNaN(num)) return null;
    if (category === "temperature") {
      return convertTemperature(num, from, to);
    }
    const fromUnit = currentCategory.units.find((u) => u.id === from);
    const toUnit = currentCategory.units.find((u) => u.id === to);
    if (!fromUnit || !toUnit) return null;
    return (num * fromUnit.factor) / toUnit.factor;
  }, [value, from, to, category, currentCategory]);

  const handleCategoryChange = (id: CategoryId) => {
    setCategory(id);
    const cat = CATEGORIES.find((c) => c.id === id)!;
    setFrom(cat.units[0].id);
    setTo(cat.units[1]?.id ?? cat.units[0].id);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const copy = async () => {
    if (result === null) return;
    const fromLabel = t(currentCategory.units.find((u) => u.id === from)?.key as never);
    const toLabel = t(currentCategory.units.find((u) => u.id === to)?.key as never);
    const text = `${value} ${fromLabel} = ${formatNumber(result)} ${toLabel}`;
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  return (
    <ToolLayout maxWidth="max-w-4xl">
      <PageHeader title={t("unitTitle")} description={t("unitDesc")} />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>{t("unitCategory")}</Label>
          <Select value={category} onValueChange={(v) => handleCategoryChange(v as CategoryId)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {t(`unit${c.id.charAt(0).toUpperCase() + c.id.slice(1)}` as never)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-2">
            <Label>{t("unitFrom")}</Label>
            <Select value={from} onValueChange={(v) => setFrom(v ?? from)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentCategory.units.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {t(u.key as never)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="icon" onClick={swap}>
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="space-y-2">
            <Label>{t("unitTo")}</Label>
            <Select value={to} onValueChange={(v) => setTo(v ?? to)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentCategory.units.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {t(u.key as never)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="unit-value">{t("unitValue")}</Label>
            <Input
              id="unit-value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("unitResult")}</Label>
            <div className="flex items-center gap-2">
              <div className="flex h-8 flex-1 items-center rounded-lg border bg-muted px-3 font-mono text-sm">
                {result !== null ? formatNumber(result) : "—"}
              </div>
              <Button variant="outline" size="icon" onClick={copy} disabled={result === null}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setValue("1");
              handleCategoryChange("length");
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("reset")}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
