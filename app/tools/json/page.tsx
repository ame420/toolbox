"use client";

import { useState } from "react";
import { Copy, Wand2, Minimize2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export default function JsonPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);

  const format = () => {
    if (!input.trim()) {
      toast.warning(t("jsonPleaseInput"));
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(
        parsed,
        sortKeys ? Object.keys(parsed).sort() : null,
        indent
      );
      setOutput(formatted);
      setError("");
      toast.success(t("jsonFormatSuccess"));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("jsonError"));
      setOutput("");
      toast.error(t("jsonError"));
    }
  };

  const minify = () => {
    if (!input.trim()) {
      toast.warning(t("jsonPleaseInput"));
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, sortKeys ? Object.keys(parsed).sort() : null));
      setError("");
      toast.success(t("jsonMinifySuccess"));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("jsonError"));
      setOutput("");
      toast.error(t("jsonError"));
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
    setError("");
  };

  return (
    <ToolLayout maxWidth="max-w-7xl">
      <PageHeader
        title={t("jsonTitle")}
        description={t("jsonDesc")}
      />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={format}>
            <Wand2 className="mr-2 h-4 w-4" />
            {t("format")}
          </Button>
          <Button variant="secondary" onClick={minify}>
            <Minimize2 className="mr-2 h-4 w-4" />
            {t("minify")}
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={!output}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copy")}
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("clear")}
          </Button>

          <div className="flex items-center gap-2">
            <Switch
              id="sort-keys"
              checked={sortKeys}
              onCheckedChange={setSortKeys}
            />
            <Label htmlFor="sort-keys">{t("jsonSortKeys")}</Label>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="indent">{t("jsonIndent")}</Label>
            <input
              id="indent"
              type="number"
              min={0}
              max={8}
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid flex-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <label className="text-sm font-medium">{t("jsonInputLabel")}</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("jsonInputPlaceholder")}
              className="min-h-[50vh] flex-1 resize-y font-mono text-sm md:min-h-[560px]"
            />
          </div>

          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <label className="text-sm font-medium">{t("jsonOutputLabel")}</label>
            <Textarea
              value={output}
              readOnly
              placeholder={t("jsonOutputPlaceholder")}
              className="min-h-[50vh] flex-1 resize-y bg-muted font-mono text-sm md:min-h-[560px]"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
