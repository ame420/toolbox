"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ImageOff, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { FileDropZone } from "@/components/file-drop-zone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const FORMATS = ["original", "jpeg", "png", "webp"] as const;
type OutputFormat = (typeof FORMATS)[number];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function CompressPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState([80]);
  const [format, setFormat] = useState<OutputFormat>("original");
  const [maxWidth, setMaxWidth] = useState<string>("");
  const [maxHeight, setMaxHeight] = useState<string>("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [outputSize, setOutputSize] = useState(0);
  const [outputType, setOutputType] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setImageUrl(url);
    setOutputUrl(null);
    setOutputSize(0);
    setOutputType("");
  };

  const compress = () => {
    if (!imageUrl || !file) {
      toast.warning(t("compressPleaseUpload"));
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let width = img.naturalWidth;
      let height = img.naturalHeight;
      const targetW = Number.parseInt(maxWidth || "0", 10);
      const targetH = Number.parseInt(maxHeight || "0", 10);

      if (targetW > 0 && width > targetW) {
        const ratio = targetW / width;
        width = targetW;
        height = Math.round(height * ratio);
      }
      if (targetH > 0 && height > targetH) {
        const ratio = targetH / height;
        height = targetH;
        width = Math.round(width * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const outputFormat = format === "original" ? file.type || "image/jpeg" : `image/${format}`;
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            toast.error(t("compressError"));
            return;
          }
          if (outputUrl) URL.revokeObjectURL(outputUrl);
          const url = URL.createObjectURL(blob);
          setOutputUrl(url);
          setOutputSize(blob.size);
          setOutputType(outputFormat);
          toast.success(t("compressSuccess"));
        },
        outputFormat,
        quality[0] / 100
      );
    };
    img.onerror = () => toast.error(t("compressError"));
    img.src = imageUrl;
  };

  const download = () => {
    if (!outputUrl || !file) return;
    const link = document.createElement("a");
    link.href = outputUrl;
    const ext = outputType.split("/")[1] || "jpg";
    link.download = `compressed-${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t("compressDownload"));
  };

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null);
    setImageUrl(null);
    setOutputUrl(null);
    setQuality([80]);
    setFormat("original");
    setMaxWidth("");
    setMaxHeight("");
    setKeepRatio(true);
    setOutputSize(0);
    setOutputType("");
  };

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [imageUrl, outputUrl]);

  return (
    <ToolLayout maxWidth="max-w-6xl">
      <PageHeader title={t("compressTitle")} description={t("compressDesc")} />

      <div className="space-y-6">
        <FileDropZone onFile={handleFile} maxSize={10 * 1024 * 1024} />

        {file && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>{t("compressFormat")}</Label>
                <Select
                  value={format}
                  onValueChange={(v) => setFormat(v as OutputFormat)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMATS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {t(`compressFormat${f.charAt(0).toUpperCase() + f.slice(1)}` as never)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("compressQuality")}: {quality[0]}%</Label>
                <Slider value={quality} onValueChange={(v) => setQuality(Array.isArray(v) ? v : [v])} min={1} max={100} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compress-width">{t("compressWidth")}</Label>
                <Input
                  id="compress-width"
                  type="number"
                  min={1}
                  placeholder="Auto"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compress-height">{t("compressHeight")}</Label>
                <Input
                  id="compress-height"
                  type="number"
                  min={1}
                  placeholder="Auto"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Label className="flex items-center gap-2 text-sm font-normal">
                <Switch checked={keepRatio} onCheckedChange={setKeepRatio} />
                {t("compressKeepRatio")}
              </Label>
              <span className="text-sm text-muted-foreground">
                {t("dropzoneSupport").replace("{size}", "10")}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={compress}>{format === "original" ? t("convert") : t("compressFormat")}</Button>
              <Button variant="secondary" onClick={download} disabled={!outputUrl}>
                <Download className="mr-2 h-4 w-4" />
                {t("compressDownload")}
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("reset")}
              </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2 rounded-lg border bg-card p-4">
                <p className="text-sm font-medium">{t("preview")}</p>
                <div className="relative overflow-hidden rounded-md border bg-muted">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt="original"
                      className="max-h-[300px] w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center">
                      <ImageOff className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {file.name} · {formatBytes(file.size)}
                </p>
              </div>

              <div className="space-y-2 rounded-lg border bg-card p-4">
                <p className="text-sm font-medium">{t("compressSuccess")}</p>
                <div className="relative overflow-hidden rounded-md border bg-muted">
                  {outputUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={outputUrl}
                      alt="compressed"
                      className="max-h-[300px] w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                      {t("preview")}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {outputUrl
                    ? `${outputType} · ${formatBytes(outputSize)}`
                    : "—"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </ToolLayout>
  );
}
