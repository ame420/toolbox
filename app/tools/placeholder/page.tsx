"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/lib/i18n";

export default function PlaceholderPage() {
  const { t } = useI18n();
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bgColor, setBgColor] = useState("#cccccc");
  const [textColor, setTextColor] = useState("#666666");
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const generate = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const displayText = text || `${width} x ${height}`;
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayText, width / 2, height / 2);

    setDataUrl(canvas.toDataURL("image/png"));
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `placeholder-${width}x${height}.png`;
    a.click();
  };

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("placeholderTitle")} description={t("placeholderDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="ph-width">{t("placeholderWidth")}</Label>
            <Input
              id="ph-width"
              type="number"
              min={1}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ph-height">{t("placeholderHeight")}</Label>
            <Input
              id="ph-height"
              type="number"
              min={1}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ph-bg">{t("placeholderBgColor")}</Label>
            <Input
              id="ph-bg"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-10 px-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ph-text-color">{t("placeholderTextColor")}</Label>
            <Input
              id="ph-text-color"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-10 px-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ph-text">{t("placeholderText")}</Label>
            <Input
              id="ph-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`${width} x ${height}`}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("placeholderFontSize")}: {fontSize}px</Label>
            <Slider
              value={[fontSize]}
              onValueChange={(v) => setFontSize(Array.isArray(v) ? v[0] : v)}
              min={12}
              max={120}
              step={1}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={generate}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("placeholderGenerate")}
          </Button>
          <Button variant="outline" onClick={handleDownload} disabled={!dataUrl}>
            <Download className="mr-2 h-4 w-4" />
            {t("placeholderDownload")}
          </Button>
        </div>

        {dataUrl && (
          <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <img
              src={dataUrl}
              alt="placeholder"
              className="max-w-full rounded-md"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
