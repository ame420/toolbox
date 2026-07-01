"use client";

import { useMemo, useState } from "react";
import { Copy, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

type TransformId =
  | "uppercase"
  | "lowercase"
  | "capitalize"
  | "reverse"
  | "sortLines"
  | "sortLinesDesc"
  | "removeDuplicates"
  | "removeEmpty"
  | "trim"
  | "reverseLines"
  | "shuffleLines"
  | "removeExtraSpaces"
  | "base64Encode"
  | "base64Decode"
  | "urlEncode"
  | "urlDecode";

const TRANSFORMS: { id: TransformId; labelKey: string }[] = [
  { id: "uppercase", labelKey: "textTransformUppercase" },
  { id: "lowercase", labelKey: "textTransformLowercase" },
  { id: "capitalize", labelKey: "textTransformCapitalize" },
  { id: "reverse", labelKey: "textTransformReverse" },
  { id: "sortLines", labelKey: "textTransformSortLines" },
  { id: "sortLinesDesc", labelKey: "textTransformSortLinesDesc" },
  { id: "removeDuplicates", labelKey: "textTransformRemoveDuplicates" },
  { id: "removeEmpty", labelKey: "textTransformRemoveEmpty" },
  { id: "trim", labelKey: "textTransformTrim" },
  { id: "reverseLines", labelKey: "textTransformReverseLines" },
  { id: "shuffleLines", labelKey: "textTransformShuffleLines" },
  { id: "removeExtraSpaces", labelKey: "textTransformRemoveExtraSpaces" },
  { id: "base64Encode", labelKey: "textTransformBase64Encode" },
  { id: "base64Decode", labelKey: "textTransformBase64Decode" },
  { id: "urlEncode", labelKey: "textTransformUrlEncode" },
  { id: "urlDecode", labelKey: "textTransformUrlDecode" },
];

function applyTransform(text: string, id: TransformId, t: (key: string) => string): string {
  switch (id) {
    case "uppercase":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    case "capitalize":
      return text.replace(/\b\w/g, (c) => c.toUpperCase());
    case "reverse":
      return text.split("").reverse().join("");
    case "sortLines":
      return text.split("\n").sort((a, b) => a.localeCompare(b)).join("\n");
    case "sortLinesDesc":
      return text.split("\n").sort((a, b) => b.localeCompare(a)).join("\n");
    case "removeDuplicates":
      return Array.from(new Set(text.split("\n"))).join("\n");
    case "removeEmpty":
      return text.split("\n").filter((line) => line.trim() !== "").join("\n");
    case "trim":
      return text.split("\n").map((line) => line.trim()).join("\n");
    case "reverseLines":
      return text.split("\n").reverse().join("\n");
    case "shuffleLines": {
      const lines = text.split("\n");
      for (let i = lines.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      return lines.join("\n");
    }
    case "removeExtraSpaces":
      return text.replace(/\s+/g, " ").trim();
    case "base64Encode":
      try {
        return btoa(unescape(encodeURIComponent(text)));
      } catch {
        toast.error(t("textTransformInvalidBase64"));
        return text;
      }
    case "base64Decode":
      try {
        return decodeURIComponent(escape(atob(text)));
      } catch {
        toast.error(t("textTransformInvalidBase64"));
        return text;
      }
    case "urlEncode":
      return encodeURIComponent(text);
    case "urlDecode":
      try {
        return decodeURIComponent(text);
      } catch {
        toast.error(t("textTransformInvalidUrl"));
        return text;
      }
    default:
      return text;
  }
}

export default function TextTransformPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [applied, setApplied] = useState<TransformId[]>([]);

  const output = useMemo(() => {
    return applied.reduce((text, id) => applyTransform(text, id, t as (key: string) => string), input);
  }, [input, applied, t]);

  const addTransform = (id: TransformId) => {
    setApplied((prev) => [...prev, id]);
  };

  const removeTransform = (index: number) => {
    setApplied((prev) => prev.filter((_, i) => i !== index));
  };

  const clearTransforms = () => {
    setApplied([]);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success(t("copied"));
  };

  const handleClear = () => {
    setInput("");
    setApplied([]);
  };

  return (
    <ToolLayout maxWidth="max-w-6xl">
      <PageHeader title={t("textTransformTitle")} description={t("textTransformDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <Label className="mb-2 block text-sm font-medium">{t("textTransformApplied")}</Label>
          {applied.length === 0 ? (
            <p className="text-sm text-muted-foreground">—</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {applied.map((id, index) => (
                <Badge key={`${id}-${index}`} variant="secondary" className="gap-1">
                  {t(TRANSFORMS.find((t) => t.id === id)?.labelKey as never)}
                  <button
                    type="button"
                    onClick={() => removeTransform(index)}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    aria-label={t("clear")}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {applied.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearTransforms} className="mt-2">
              {t("textTransformClear")}
            </Button>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {TRANSFORMS.map((transform) => (
            <Button
              key={transform.id}
              variant="outline"
              size="sm"
              onClick={() => addTransform(transform.id)}
            >
              {t(transform.labelKey as never)}
            </Button>
          ))}
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t("htmlEntitiesInput")}</Label>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t("clear")}
              </Button>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("pleaseInput")}
              className="min-h-[40vh] flex-1 resize-y font-mono text-sm md:min-h-[480px]"
            />
          </div>

          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t("htmlEntitiesOutput")}</Label>
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
                <Copy className="mr-2 h-4 w-4" />
                {t("copy")}
              </Button>
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder={t("htmlEntitiesOutput")}
              className="min-h-[40vh] flex-1 resize-y bg-muted font-mono text-sm md:min-h-[480px]"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
