"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import QRCode from "qrcode";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const ERROR_LEVELS = ["L", "M", "Q", "H"] as const;

type ErrorLevel = (typeof ERROR_LEVELS)[number];

export default function QrCodePage() {
  const { t } = useI18n();
  const [content, setContent] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [width, setWidth] = useState(320);
  const [level, setLevel] = useState<ErrorLevel>("M");
  const [dataUrl, setDataUrl] = useState<string>("");

  const generate = async () => {
    if (!content.trim()) {
      toast.warning(t("pleaseInput"));
      return;
    }
    try {
      const url = await QRCode.toDataURL(content, {
        width,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: level,
      });
      setDataUrl(url);
      toast.success(t("success"));
    } catch (error) {
      toast.error(t("error"));
      console.error(error);
    }
  };

  const download = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t("qrcodeDownload"));
  };

  // Generate a sample QR code on first mount so the page isn't empty.
  useEffect(() => {
    QRCode.toDataURL(t("siteName"), {
      width: 320,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: "M",
    }).then(setDataUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("qrcodeTitle")} description={t("qrcodeDesc")} />

      <div className="grid flex-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qr-content">{t("qrcodeContent")}</Label>
            <Textarea
              id="qr-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("qrcodeContentPlaceholder")}
              className="min-h-32 resize-y"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="qr-fg">{t("qrcodeFgColor")}</Label>
              <div className="flex gap-2">
                <Input
                  id="qr-fg"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-10 w-14 shrink-0 px-1 py-1"
                />
                <Input
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qr-bg">{t("qrcodeBgColor")}</Label>
              <div className="flex gap-2">
                <Input
                  id="qr-bg"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-14 shrink-0 px-1 py-1"
                />
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="qr-width">{t("qrcodeWidth")}</Label>
              <Input
                id="qr-width"
                type="number"
                min={128}
                max={1024}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("qrcodeErrorLevel")}</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as ErrorLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ERROR_LEVELS.map((lv) => (
                    <SelectItem key={lv} value={lv}>
                      {t(`qrcodeErrorLevel${lv}` as never)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={generate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("qrcodeGenerate")}
            </Button>
            <Button variant="secondary" onClick={download} disabled={!dataUrl}>
              <Download className="mr-2 h-4 w-4" />
              {t("qrcodeDownload")}
            </Button>
          </div>
        </div>

        <div className="flex min-h-[320px] items-center justify-center rounded-lg border bg-card p-6 shadow-sm">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dataUrl}
              alt={t("qrcodeTitle")}
              className="max-h-80 max-w-full rounded-md"
            />
          ) : (
            <span className="text-muted-foreground">{t("preview")}</span>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
