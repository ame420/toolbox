"use client";

import { useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { parseCron, explainCron } from "@/lib/cron-parser";

const PRESETS = [
  { labelKey: "cronPresetEveryMinute", value: "* * * * *" },
  { labelKey: "cronPresetEveryHour", value: "0 * * * *" },
  { labelKey: "cronPresetDaily", value: "0 9 * * *" },
  { labelKey: "cronPresetWeekdays", value: "0 9 * * 1-5" },
  { labelKey: "cronPresetWeekly", value: "0 9 * * 0" },
];

export default function CronPage() {
  const { t } = useI18n();
  const [expression, setExpression] = useState("0 9 * * 1-5");
  const [result, setResult] = useState(parseCron("0 9 * * 1-5"));

  const handleParse = () => {
    if (!expression) {
      toast.warning(t("pleaseInput"));
      return;
    }
    setResult(parseCron(expression));
  };

  const handleCopy = async () => {
    if (!result.valid || !result.nextExecutions) return;
    const text = result.nextExecutions
      .map((d) => d.toLocaleString())
      .join("\n");
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  const handleClear = () => {
    setExpression("");
    setResult({ valid: false });
  };

  const applyPreset = (value: string) => {
    setExpression(value);
    setResult(parseCron(value));
  };

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader title={t("cronTitle")} description={t("cronDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
          <Label htmlFor="cron-expression">{t("cronExpression")}</Label>
          <Input
            id="cron-expression"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="0 9 * * 1-5"
            className="font-mono"
          />
          <div className="flex flex-wrap gap-2 pt-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset.value)}
              >
                {t(preset.labelKey as never)}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleParse}>{t("cronExplanation")}</Button>
          <Button variant="outline" onClick={handleCopy} disabled={!result.valid}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copy")}
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("clear")}
          </Button>
        </div>

        {expression && (
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant={result.valid ? "default" : "destructive"}>
                {result.valid ? t("success") : t("cronInvalid")}
              </Badge>
            </div>

            {result.valid ? (
              <div className="space-y-4">
                <div className="whitespace-pre-wrap rounded-md bg-muted p-3 font-mono text-sm">
                  {explainCron(expression, t as (key: string) => string)}
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium">{t("cronNextExecutions")}</Label>
                  {result.nextExecutions && result.nextExecutions.length > 0 ? (
                    <ul className="space-y-1 rounded-md border bg-background p-3">
                      {result.nextExecutions.map((date, index) => (
                        <li key={index} className="font-mono text-sm">
                          {date.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("cronNoMatches")}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-destructive">{t("cronInvalid")}</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
