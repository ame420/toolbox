"use client";

import { useMemo, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  // Count Chinese characters as words
  const chinese = (trimmed.match(/[一-龥]/g) || []).length;

  // Count non-Chinese word groups
  const nonChinese = trimmed
    .replace(/[一-龥]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return chinese + nonChinese;
}

export default function TextStatsPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");

  const stats = useMemo(() => {
    return {
      chars: input.length,
      charsNoSpace: input.replace(/\s/g, "").length,
      words: countWords(input),
      lines: input ? input.split(/\n/).length : 0,
      bytesUtf8: new TextEncoder().encode(input).length,
      bytesUtf16: input.length * 2,
      chinese: (input.match(/[一-龥]/g) || []).length,
      numbers: (input.match(/\d/g) || []).length,
      punctuation: (input.match(/[^\w\s一-龥]/g) || []).length,
    };
  }, [input]);

  const handleCopy = async (value: string | number) => {
    await navigator.clipboard.writeText(String(value));
    toast.success(t("copied"));
  };

  const handleClear = () => {
    setInput("");
  };

  const statItems = [
    { label: t("textStatsChars"), value: stats.chars },
    { label: t("textStatsCharsNoSpace"), value: stats.charsNoSpace },
    { label: t("textStatsWords"), value: stats.words },
    { label: t("textStatsLines"), value: stats.lines },
    { label: t("textStatsBytes"), value: stats.bytesUtf8 },
    { label: t("textStatsBytes16"), value: stats.bytesUtf16 },
    { label: t("textStatsChinese"), value: stats.chinese },
    { label: t("textStatsNumbers"), value: stats.numbers },
    { label: t("textStatsPunctuation"), value: stats.punctuation },
  ];

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("textStatsTitle")} description={t("textStatsDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleCopy(input)} disabled={!input}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copy")}
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("clear")}
          </Button>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
          <Label className="text-sm font-medium" htmlFor="text-stats-input">{t("textStatsInput")}</Label>
          <Textarea
            id="text-stats-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("pleaseInput")}
            className="min-h-[30vh] resize-y font-mono text-sm"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {statItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleCopy(item.value)}
              className="flex flex-col items-start rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent"
            >
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="mt-1 text-2xl font-semibold tabular-nums">{item.value}</span>
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
