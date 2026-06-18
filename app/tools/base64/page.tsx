"use client";

import { useState } from "react";
import { ArrowDownUp, Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export default function Base64Page() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const process = () => {
    if (!input) {
      toast.warning(t("pleaseInput"));
      return;
    }
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
      toast.success(mode === "encode" ? t("base64EncodeSuccess") : t("base64DecodeSuccess"));
    } catch (error) {
      toast.error(mode === "encode" ? t("base64EncodeError") : t("base64DecodeError"));
      console.error(error);
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
      <PageHeader
        title={t("base64Title")}
        description={t("base64Desc")}
      />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            onClick={() => setMode("encode")}
          >
            {t("encode")}
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            onClick={() => setMode("decode")}
          >
            {t("decode")}
          </Button>
          <Button variant="secondary" onClick={toggleMode}>
            <ArrowDownUp className="mr-2 h-4 w-4" />
            {t("swap")}
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={!output}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copy")}
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("clear")}
          </Button>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <label className="text-sm font-medium">
              {mode === "encode" ? t("base64Source") : t("base64Encoded")}
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? t("pleaseInput") : t("base64Encoded")}
              className="min-h-[40vh] flex-1 resize-y font-mono text-sm md:min-h-[480px]"
            />
          </div>

          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <label className="text-sm font-medium">
              {mode === "encode" ? t("base64Encoded") : t("base64Source")}
            </label>
            <Textarea
              value={output}
              readOnly
              placeholder={t("base64Result")}
              className="min-h-[40vh] flex-1 resize-y bg-muted font-mono text-sm md:min-h-[480px]"
            />
          </div>
        </div>

        <Button onClick={process} className="w-full md:w-auto">
          {mode === "encode" ? t("base64Encode") : t("base64Decode")}
        </Button>
      </div>
    </ToolLayout>
  );
}
