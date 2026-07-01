"use client";

import { useState } from "react";
import { ArrowDownUp, Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const NAMED_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function encodeHtmlEntities(input: string, numeric: boolean): string {
  return input
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code > 127 || NAMED_ENTITIES[char]) {
        if (!numeric && NAMED_ENTITIES[char]) {
          return NAMED_ENTITIES[char];
        }
        return `&#${code};`;
      }
      return char;
    })
    .join("");
}

function decodeHtmlEntities(input: string): string {
  if (typeof document === "undefined") return input;

  const textarea = document.createElement("textarea");
  textarea.innerHTML = input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
  return textarea.value;
}

export default function HtmlEntitiesPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [numeric, setNumeric] = useState(false);

  const process = () => {
    if (!input) {
      toast.warning(t("pleaseInput"));
      return;
    }

    try {
      if (mode === "encode") {
        setOutput(encodeHtmlEntities(input, numeric));
      } else {
        setOutput(decodeHtmlEntities(input));
      }
      toast.success(t("success"));
    } catch {
      toast.error(t("htmlEntitiesInvalid"));
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success(t("copied"));
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "encode" ? "decode" : "encode"));
    setInput(output);
    setOutput(input);
  };

  return (
    <ToolLayout maxWidth="max-w-6xl">
      <PageHeader title={t("htmlEntitiesTitle")} description={t("htmlEntitiesDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            onClick={() => setMode("encode")}
          >
            {t("htmlEntitiesEncode")}
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            onClick={() => setMode("decode")}
          >
            {t("htmlEntitiesDecode")}
          </Button>
          <Button variant="secondary" onClick={toggleMode}>
            <ArrowDownUp className="mr-2 h-4 w-4" />
            {t("swap")}
          </Button>

          {mode === "encode" && (
            <div className="flex items-center gap-2">
              <Switch id="numeric" checked={numeric} onCheckedChange={setNumeric} />
              <Label htmlFor="numeric" className="text-sm">
                {numeric ? t("htmlEntitiesNumeric") : t("htmlEntitiesNamed")}
              </Label>
            </div>
          )}

          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={handleCopy} disabled={!output}>
              <Copy className="mr-2 h-4 w-4" />
              {t("copy")}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t("clear")}
            </Button>
          </div>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <Label className="text-sm font-medium">{t("htmlEntitiesInput")}</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("pleaseInput")}
              className="min-h-[40vh] flex-1 resize-y font-mono text-sm md:min-h-[480px]"
            />
          </div>

          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <Label className="text-sm font-medium">{t("htmlEntitiesOutput")}</Label>
            <Textarea
              value={output}
              readOnly
              placeholder={t("htmlEntitiesOutput")}
              className="min-h-[40vh] flex-1 resize-y bg-muted font-mono text-sm md:min-h-[480px]"
            />
          </div>
        </div>

        <Button onClick={process} className="w-full md:w-auto">
          {mode === "encode" ? t("htmlEntitiesEncode") : t("htmlEntitiesDecode")}
        </Button>
      </div>
    </ToolLayout>
  );
}
