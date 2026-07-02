"use client";

import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { generateAsciiArt } from "@/lib/ascii-font";

export default function AsciiArtPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("HELLO");
  const [output, setOutput] = useState("");
  const [hasUnsupported, setHasUnsupported] = useState(false);

  const handleGenerate = () => {
    if (!input.trim()) {
      toast.error(t("pleaseInput"));
      return;
    }
    const supported = /^[A-Z0-9 !?.,\-_]+$/i;
    setHasUnsupported(!supported.test(input));
    setOutput(generateAsciiArt(input));
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success(t("copied"));
  };

  return (
    <ToolLayout maxWidth="max-w-4xl">
      <PageHeader title={t("asciiArtTitle")} description={t("asciiArtDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="ascii-input">{t("asciiArtInput")}</Label>
          <Input
            id="ascii-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("asciiArtInputPlaceholder")}
            maxLength={20}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleGenerate}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("asciiArtGenerate")}
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={!output}>
            <Copy className="mr-2 h-4 w-4" />
            {t("asciiArtCopy")}
          </Button>
        </div>

        {hasUnsupported && (
          <p className="text-sm text-amber-600">{t("asciiArtUnsupportedChars")}</p>
        )}

        {output && (
          <Textarea
            value={output}
            readOnly
            className="min-h-[260px] resize-y bg-muted font-mono text-sm leading-none"
          />
        )}
      </div>
    </ToolLayout>
  );
}
