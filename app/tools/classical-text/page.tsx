"use client";

import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import {
  CLASSICAL_TEXT_TYPES,
  type ClassicalType,
  generateClassicalText,
} from "@/lib/classical-text";

export default function ClassicalTextPage() {
  const { lang, t } = useI18n();
  const [type, setType] = useState<ClassicalType>("analects");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    setOutput(generateClassicalText(type, count));
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success(t("copied"));
  };

  return (
    <ToolLayout maxWidth="max-w-4xl">
      <PageHeader title={t("classicalTextTitle")} description={t("classicalTextDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("classicalTextType")}</Label>
            <Select value={type} onValueChange={(v) => setType(v as ClassicalType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLASSICAL_TEXT_TYPES.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {lang === "zh" ? item.titleZh : item.titleEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("classicalTextCount")}: {count}</Label>
            <Slider
              value={[count]}
              onValueChange={(v) => setCount(Array.isArray(v) ? v[0] : v)}
              min={1}
              max={10}
              step={1}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleGenerate}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("classicalTextGenerate")}
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={!output}>
            <Copy className="mr-2 h-4 w-4" />
            {t("classicalTextCopy")}
          </Button>
        </div>

        {output && (
          <Textarea
            value={output}
            readOnly
            className="min-h-[40vh] resize-y bg-muted text-sm leading-relaxed"
          />
        )}
      </div>
    </ToolLayout>
  );
}
