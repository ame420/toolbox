"use client";

import { useState } from "react";
import { ArrowRightLeft, Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import * as OpenCC from "opencc-js";
import { useI18n } from "@/lib/i18n";

interface ModeConfig {
  value: string;
  from: string;
  to: string;
}

const MODES: ModeConfig[] = [
  { value: "s2t", from: "cn", to: "t" },
  { value: "t2s", from: "t", to: "cn" },
  { value: "s2tw", from: "cn", to: "tw" },
  { value: "tw2s", from: "tw", to: "cn" },
  { value: "s2hk", from: "cn", to: "hk" },
  { value: "hk2s", from: "hk", to: "cn" },
];

export default function ConverterPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("s2t");
  const [output, setOutput] = useState("");

  const modeLabels: Record<string, string> = {
    s2t: t("modeS2T"),
    t2s: t("modeT2S"),
    s2tw: t("modeS2TW"),
    tw2s: t("modeTW2S"),
    s2hk: t("modeS2HK"),
    hk2s: t("modeHK2S"),
  };

  const handleConvert = () => {
    if (!input.trim()) {
      toast.warning(t("converterPleaseInput"));
      return;
    }
    const config = MODES.find((m) => m.value === mode);
    if (!config) {
      toast.error(t("converterInvalidMode"));
      return;
    }
    try {
      const converter = OpenCC.Converter({ from: config.from, to: config.to });
      setOutput(converter(input));
      toast.success(t("converterSuccess"));
    } catch (error) {
      toast.error(t("converterError"));
      console.error(error);
    }
  };

  const handleCopy = async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <ToolLayout maxWidth="max-w-6xl">
      <PageHeader
        title={t("converterTitle")}
        description={t("converterDesc")}
      />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={mode} onValueChange={(value) => value && setMode(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("converterMode")} />
            </SelectTrigger>
            <SelectContent>
              {MODES.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {modeLabels[m.value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleConvert}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            {t("convert")}
          </Button>

          <Button variant="outline" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("clear")}
          </Button>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <label className="text-sm font-medium">{t("converterInput")}</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("converterPleaseInput")}
              className="min-h-[40vh] flex-1 resize-y text-base md:min-h-[480px]"
            />
          </div>

          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{t("converterOutput")}</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(output)}
                disabled={!output}
              >
                <Copy className="mr-1 h-4 w-4" />
                {t("copy")}
              </Button>
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder={t("converterOutputPlaceholder")}
              className="min-h-[40vh] flex-1 resize-y bg-muted text-base md:min-h-[480px]"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
