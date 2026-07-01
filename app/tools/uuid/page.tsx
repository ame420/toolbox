"use client";

import { useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

function generateUuidV4(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export default function UuidPage() {
  const { t } = useI18n();
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    const result: string[] = [];
    for (let i = 0; i < count; i += 1) {
      let uuid = generateUuidV4();
      if (!hyphens) {
        uuid = uuid.replace(/-/g, "");
      }
      if (uppercase) {
        uuid = uuid.toUpperCase();
      }
      result.push(uuid);
    }
    setUuids(result);
  };

  const handleCopyAll = async () => {
    if (uuids.length === 0) return;
    await navigator.clipboard.writeText(uuids.join("\n"));
    toast.success(t("copied"));
  };

  const handleCopyOne = async (uuid: string) => {
    await navigator.clipboard.writeText(uuid);
    toast.success(t("copied"));
  };

  const handleClear = () => {
    setUuids([]);
  };

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader title={t("uuidTitle")} description={t("uuidDesc")} />

      <div className="flex flex-1 flex-col gap-6">
        <div className="grid gap-6 rounded-lg border bg-card p-4 shadow-sm sm:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("uuidCount")}: {count}</Label>
              <Slider
                value={[count]}
                onValueChange={(v) => setCount(Array.isArray(v) ? v[0] : v)}
                min={1}
                max={100}
                step={1}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="uuid-uppercase">{t("uuidUppercase")}</Label>
              <Switch
                id="uuid-uppercase"
                checked={uppercase}
                onCheckedChange={setUppercase}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="uuid-hyphens">{t("uuidHyphens")}</Label>
              <Switch
                id="uuid-hyphens"
                checked={hyphens}
                onCheckedChange={setHyphens}
              />
            </div>
          </div>

          <div className="flex flex-col justify-end gap-3">
            <Button onClick={generate} className="w-full">
              {t("uuidGenerate")}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopyAll} disabled={uuids.length === 0} className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                {t("uuidCopyAll")}
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={uuids.length === 0} className="flex-1">
                <Trash2 className="mr-2 h-4 w-4" />
                {t("clear")}
              </Button>
            </div>
          </div>
        </div>

        {uuids.length > 0 && (
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <Label className="mb-3 block text-sm font-medium">{t("uuidBulk")}</Label>
            <div className="flex max-h-[50vh] flex-col gap-2 overflow-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={`${uuid}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-md border p-2"
                >
                  <span className="break-all font-mono text-sm">{uuid}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleCopyOne(uuid)}
                    aria-label={t("copy")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
