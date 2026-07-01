"use client";

import { useMemo, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { analyzePassword } from "@/lib/password-strength";

const SCORE_COLORS = [
  "bg-destructive",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
];

export default function PasswordStrengthPage() {
  const { t } = useI18n();
  const [password, setPassword] = useState("");

  const analysis = useMemo(() => analyzePassword(password, t as (key: string) => string), [password, t]);

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    toast.success(t("copied"));
  };

  const handleClear = () => {
    setPassword("");
  };

  const scoreLabel = t(`passwordStrengthScore${analysis.score}` as never);

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader title={t("passwordStrengthTitle")} description={t("passwordStrengthDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
          <Label htmlFor="password-input">{t("passwordStrengthInput")}</Label>
          <Input
            id="password-input"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="P@ssw0rd!123"
            className="font-mono"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleCopy} disabled={!password}>
              <Copy className="mr-2 h-4 w-4" />
              {t("copy")}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t("clear")}
            </Button>
          </div>
        </div>

        {password && (
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <Badge variant={analysis.score >= 3 ? "default" : "destructive"}>{scoreLabel}</Badge>
              <span className="text-sm text-muted-foreground">{analysis.entropy} bits</span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all ${SCORE_COLORS[analysis.score]}`}
                style={{ width: `${(analysis.score + 1) * 20}%` }}
              />
            </div>

            <dl className="mt-4 grid grid-cols-[8rem_1fr] gap-2 text-sm">
              <dt className="text-muted-foreground">{t("passwordStrengthLength")}</dt>
              <dd>{analysis.length}</dd>
              <dt className="text-muted-foreground">{t("passwordStrengthPool")}</dt>
              <dd>{analysis.poolSize}</dd>
              <dt className="text-muted-foreground">{t("passwordStrengthEntropy")}</dt>
              <dd>{analysis.entropy} bits</dd>
              <dt className="text-muted-foreground">{t("passwordStrengthCrackTime")}</dt>
              <dd>{analysis.crackTimeDisplay}</dd>
            </dl>

            {analysis.feedback.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">{t("passwordStrengthFeedback")}</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {analysis.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
