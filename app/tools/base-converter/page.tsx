"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Copy, Trash2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const BASES = [
  { value: 2, labelKey: "baseConverterBinary" },
  { value: 8, labelKey: "baseConverterOctal" },
  { value: 10, labelKey: "baseConverterDecimal" },
  { value: 16, labelKey: "baseConverterHex" },
  { value: 36, labelKey: "baseConverterBase36" },
  { value: 62, labelKey: "baseConverterBase62" },
] as const;

function toBase62(value: bigint): string {
  if (value === BigInt(0)) return "0";
  const base = BigInt(62);
  let result = "";
  let num = value < BigInt(0) ? -value : value;
  while (num > BigInt(0)) {
    result = BASE62[Number(num % base)] + result;
    num /= base;
  }
  return value < BigInt(0) ? `-${result}` : result;
}

function fromBase62(input: string): bigint | null {
  if (!input) return null;
  const negative = input.startsWith("-");
  const str = negative ? input.slice(1) : input;
  let result = BigInt(0);
  for (const char of str) {
    const index = BASE62.indexOf(char);
    if (index === -1) return null;
    result = result * BigInt(62) + BigInt(index);
  }
  return negative ? -result : result;
}

function convert(input: string, fromBase: number, toBase: number): string | null {
  if (!input) return "";

  let value: bigint;
  if (fromBase === 62) {
    const parsed = fromBase62(input);
    if (parsed === null) return null;
    value = parsed;
  } else {
    const normalized = input.toUpperCase();
    if (!normalized.split("").every((c) => {
      const code = c.charCodeAt(0);
      if (code >= 48 && code <= 57) return code - 48 < fromBase;
      if (code >= 65 && code <= 90) return code - 55 < fromBase;
      return c === "-";
    })) {
      return null;
    }
    value = BigInt(parseInt(normalized, fromBase));
    if (Number.isNaN(Number(value))) return null;
  }

  if (toBase === 62) return toBase62(value);
  return value.toString(toBase).toUpperCase();
}

export default function BaseConverterPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [showAll, setShowAll] = useState(false);

  const result = useMemo(() => convert(input, fromBase, toBase), [input, fromBase, toBase]);

  const allResults = useMemo(() => {
    if (!showAll || !input) return [];
    return BASES.map((base) => ({
      base: base.value,
      label: t(base.labelKey),
      value: convert(input, fromBase, base.value),
    }));
  }, [input, fromBase, showAll, t]);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    toast.success(t("copied"));
  };

  const handleClear = () => {
    setInput("");
  };

  const swap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
  };

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader title={t("baseConverterTitle")} description={t("baseConverterDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
          <Label htmlFor="base-input">{t("baseConverterInput")}</Label>
          <Input
            id="base-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="255"
            className="font-mono"
          />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-2">
            <Label className="text-sm">{t("baseConverterFromBase")}</Label>
            <Select value={String(fromBase)} onValueChange={(v) => setFromBase(Number(v))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BASES.map((base) => (
                  <SelectItem key={base.value} value={String(base.value)}>
                    {t(base.labelKey as never)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="secondary" onClick={swap}>
            <ArrowDownUp className="mr-2 h-4 w-4" />
            {t("swap")}
          </Button>

          <div className="flex flex-col gap-2">
            <Label className="text-sm">{t("baseConverterToBase")}</Label>
            <Select value={String(toBase)} onValueChange={(v) => setToBase(Number(v))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BASES.map((base) => (
                  <SelectItem key={base.value} value={String(base.value)}>
                    {t(base.labelKey as never)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
          <Label>{t("baseConverterResult")}</Label>
          <div className="min-h-[2.5rem] break-all rounded-md bg-muted p-3 font-mono text-sm">
            {result === null ? (
              <span className="text-destructive">{t("baseConverterInvalid")}</span>
            ) : (
              result || "-"
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCopy} disabled={!result}>
              <Copy className="mr-2 h-4 w-4" />
              {t("copy")}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t("clear")}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="show-all" checked={showAll} onCheckedChange={setShowAll} />
          <Label htmlFor="show-all">{t("baseConverterShowAll")}</Label>
        </div>

        {showAll && allResults.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {allResults.map((item) => (
              <div key={item.base} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="ml-2 break-all font-mono text-sm">
                  {item.value === null ? "-" : item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
