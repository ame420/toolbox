"use client";

import { useState, useRef, useCallback } from "react";
import { Trash2, Pipette } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { FileDropZone } from "@/components/file-drop-zone";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface ColorInfo {
  r: number;
  g: number;
  b: number;
  hex: string;
  x: number;
  y: number;
}

export default function RgbPage() {
  const { t } = useI18n();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [color, setColor] = useState<ColorInfo | null>(null);
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setColor(null);
    setColors([]);
  };

  const onImageLoad = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  };

  const pickColor = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img) return;

      const rect = img.getBoundingClientRect();
      const scaleX = img.naturalWidth / rect.width;
      const scaleY = img.naturalHeight / rect.height;
      const x = Math.round((e.clientX - rect.left) * scaleX);
      const y = Math.round((e.clientY - rect.top) * scaleY);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const info: ColorInfo = {
        r: pixel[0],
        g: pixel[1],
        b: pixel[2],
        hex: `#${[pixel[0], pixel[1], pixel[2]]
          .map((v) => v.toString(16).padStart(2, "0"))
          .join("")}`,
        x,
        y,
      };
      setColor(info);
      setColors((prev) => [info, ...prev].slice(0, 10));
    },
    []
  );

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  const clear = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setColor(null);
    setColors([]);
  };

  return (
    <ToolLayout maxWidth="max-w-6xl">
      <PageHeader
        title={t("rgbTitle")}
        description={t("rgbDesc")}
      />

      <div className="space-y-6">
        <FileDropZone onFile={handleFile} maxSize={5 * 1024 * 1024} />

        {imageUrl && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={clear}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t("clear")}
              </Button>
              <span className="inline-flex items-center text-sm text-muted-foreground">
                <Pipette className="mr-1 h-4 w-4" />
                {t("rgbHint")}
              </span>
            </div>

            <div className="relative overflow-hidden rounded-lg border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imageUrl}
                alt={t("rgbImageAlt")}
                onLoad={onImageLoad}
                onClick={pickColor}
                className="max-h-[500px] w-full cursor-crosshair object-contain"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {color && (
              <div className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
                <div
                  className="h-24 rounded-lg border shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="col-span-1 flex flex-col justify-center space-y-2 sm:col-span-1 lg:col-span-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" onClick={() => copy(color.hex)}>
                      {t("rgbHex")}: {color.hex}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => copy(`rgb(${color.r}, ${color.g}, ${color.b})`)}
                    >
                      RGB: {color.r}, {color.g}, {color.b}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {t("rgbCoord")}: ({color.x}, {color.y})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("rgbRecent")}</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => copy(c.hex)}
                      className="flex h-10 w-10 rounded-md border shadow-sm transition-transform hover:scale-110"
                      style={{ backgroundColor: c.hex }}
                      title={c.hex}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
