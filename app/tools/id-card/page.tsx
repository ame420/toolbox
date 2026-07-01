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
import { validateIdCard, type IdCardResult } from "@/lib/id-card";

export default function IdCardPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<IdCardResult | null>(null);

  const handleValidate = () => {
    if (!input) {
      toast.warning(t("pleaseInput"));
      return;
    }
    setResult(validateIdCard(input));
  };

  const handleCopy = async () => {
    if (!result?.valid) return;
    const text = [
      `${t("idCardProvince")}: ${result.province}`,
      `${t("idCardBirthDate")}: ${result.birthDate}`,
      `${t("idCardGender")}: ${result.gender === "male" ? t("idCardMale") : t("idCardFemale")}`,
      `${t("idCardAge")}: ${result.age}`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
  };

  const errorMap: Record<string, string> = {
    length: t("idCardErrorLength"),
    format: t("idCardErrorFormat"),
    province: t("idCardErrorProvince"),
    date: t("idCardErrorDate"),
    check: t("idCardErrorCheck"),
  };

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader title={t("idCardTitle")} description={t("idCardDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
          <Label htmlFor="id-card-input">{t("idCardInput")}</Label>
          <Input
            id="id-card-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="110101199001011234"
            className="font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleValidate}>{t("idCardValidate")}</Button>
          <Button variant="outline" onClick={handleCopy} disabled={!result?.valid}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copy")}
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("clear")}
          </Button>
        </div>

        {result && (
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant={result.valid ? "default" : "destructive"}>
                {result.valid ? t("idCardValid") : t("idCardInvalid")}
              </Badge>
              {!result.valid && result.error && (
                <span className="text-sm text-destructive">{errorMap[result.error] || t("error")}</span>
              )}
            </div>

            {result.valid && (
              <dl className="grid grid-cols-[6rem_1fr] gap-3 text-sm">
                <dt className="text-muted-foreground">{t("idCardProvince")}</dt>
                <dd>{result.province}</dd>
                <dt className="text-muted-foreground">{t("idCardBirthDate")}</dt>
                <dd>{result.birthDate}</dd>
                <dt className="text-muted-foreground">{t("idCardGender")}</dt>
                <dd>{result.gender === "male" ? t("idCardMale") : t("idCardFemale")}</dd>
                <dt className="text-muted-foreground">{t("idCardAge")}</dt>
                <dd>{result.age}</dd>
                {result.checkDigit && (
                  <>
                    <dt className="text-muted-foreground">{t("idCardCheckDigit")}</dt>
                    <dd className="font-mono">{result.checkDigit}</dd>
                  </>
                )}
              </dl>
            )}

            {result.valid && !result.checkDigit && (
              <p className="mt-3 text-xs text-muted-foreground">{t("idCard15Hint")}</p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
