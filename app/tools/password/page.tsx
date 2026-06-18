"use client";

import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function PasswordPage() {
  const { t } = useI18n();
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);

  const generate = () => {
    let chars = "";
    if (includeLowercase) chars += LOWERCASE;
    if (includeUppercase) chars += UPPERCASE;
    if (includeNumbers) chars += NUMBERS;
    if (includeSymbols) chars += SYMBOLS;

    if (!chars) {
      toast.warning(t("passwordTypeRequired"));
      return;
    }

    if (excludeAmbiguous) {
      chars = chars.replace(/[0O1lI]/g, "");
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    toast.success(t("copied"));
  };

  const getStrength = () => {
    if (!password) return { label: t("strengthNone"), color: "bg-muted" };
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { label: t("strengthWeak"), color: "bg-destructive" };
    if (score <= 4) return { label: t("strengthMedium"), color: "bg-yellow-500" };
    return { label: t("strengthStrong"), color: "bg-green-500" };
  };

  const strength = getStrength();

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader
        title={t("passwordTitle")}
        description={t("passwordDesc")}
      />

      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <Label className="mb-2 block">{t("passwordLength")}: {length}</Label>
          <Slider
            value={[length]}
            onValueChange={(v) => setLength((v as number[])[0])}
            min={4}
            max={64}
            step={1}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { id: "uppercase", label: t("includeUppercase"), checked: includeUppercase, onChange: setIncludeUppercase },
            { id: "lowercase", label: t("includeLowercase"), checked: includeLowercase, onChange: setIncludeLowercase },
            { id: "numbers", label: t("includeNumbers"), checked: includeNumbers, onChange: setIncludeNumbers },
            { id: "symbols", label: t("includeSymbols"), checked: includeSymbols, onChange: setIncludeSymbols },
          ].map(({ id, label, checked, onChange }) => (
            <div key={id} className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor={id} className="cursor-pointer">{label}</Label>
              <Switch
                id={id}
                checked={checked}
                onCheckedChange={onChange}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="ambiguous"
            checked={excludeAmbiguous}
            onCheckedChange={setExcludeAmbiguous}
          />
          <Label htmlFor="ambiguous" className="cursor-pointer">
            {t("excludeAmbiguous")}
          </Label>
        </div>

        <div className="flex gap-3">
          <Button onClick={generate}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("generatePassword")}
          </Button>
          <Button variant="outline" onClick={copy} disabled={!password}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copy")}
          </Button>
        </div>

        {password && (
          <div className="space-y-3 rounded-lg border bg-card p-4">
            <Input
              value={password}
              readOnly
              className="text-center font-mono text-lg tracking-wider"
            />
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${strength.color} transition-all`}
                  style={{ width: password ? "100%" : "0%" }}
                />
              </div>
              <span className="text-sm font-medium">{strength.label}</span>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
