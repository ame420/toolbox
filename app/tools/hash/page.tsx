"use client";

import { useState } from "react";
import { Copy, RotateCcw, Sparkles } from "lucide-react";
import { md5 } from "js-md5";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const ALGORITHMS = ["md5", "sha1", "sha256", "sha512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

async function shaDigest(algorithm: Algorithm, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const algo = algorithm === "sha1" ? "SHA-1" : algorithm === "sha256" ? "SHA-256" : "SHA-512";
  const buffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function computeHash(algorithm: Algorithm, text: string): Promise<string> {
  if (algorithm === "md5") return md5(text);
  return shaDigest(algorithm, text);
}

export default function HashPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("sha256");
  const [uppercase, setUppercase] = useState(false);
  const [result, setResult] = useState("");

  const generate = async () => {
    if (!input) {
      toast.warning(t("hashPleaseInput"));
      return;
    }
    const hash = await computeHash(algorithm, input);
    setResult(uppercase ? hash.toUpperCase() : hash);
    toast.success(t("success"));
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    toast.success(t("copied"));
  };

  const reset = () => {
    setInput("");
    setAlgorithm("sha256");
    setUppercase(false);
    setResult("");
  };

  return (
    <ToolLayout maxWidth="max-w-4xl">
      <PageHeader title={t("hashTitle")} description={t("hashDesc")} />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hash-input">{t("hashInput")}</Label>
          <Textarea
            id="hash-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("hashPleaseInput")}
            className="min-h-32 font-mono text-sm"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("hashAlgorithm")}</Label>
            <Select
              value={algorithm}
              onValueChange={(v) => setAlgorithm(v as Algorithm)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALGORITHMS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {t(`hash${a.toUpperCase().replace("SHA", "Sha")}` as never)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <Switch checked={uppercase} onCheckedChange={setUppercase} />
            <Label className="font-normal">{t("hashUppercase")}</Label>
          </div>
        </div>

        <Button onClick={generate} className="w-full md:w-auto">
          <Sparkles className="mr-2 h-4 w-4" />
          {t("generate")}
        </Button>

        <div className="space-y-2">
          <Label>{t("unitResult")}</Label>
          <div className="flex items-center gap-2">
            <div className="flex h-10 flex-1 items-center overflow-hidden rounded-lg border bg-muted px-3 font-mono text-sm">
              <span className="truncate">{result || "—"}</span>
            </div>
            <Button variant="outline" size="icon" onClick={copy} disabled={!result}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("reset")}
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
