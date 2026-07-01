"use client";

import { useEffect, useState } from "react";
import { Copy, Download, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileDropZone } from "@/components/file-drop-zone";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export default function ImgToBase64Page() {
  const { t } = useI18n();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [base64, setBase64] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = (file: File) => {
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const reader = new FileReader();
    reader.onload = () => {
      setBase64(reader.result as string);
    };
    reader.readAsDataURL(file);

    return () => {
      URL.revokeObjectURL(url);
    };
  };

  const handleClear = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setBase64("");
    setFileName("");
  };

  const handleCopy = async () => {
    if (!base64) return;
    await navigator.clipboard.writeText(base64);
    toast.success(t("copied"));
  };

  const handleDownload = () => {
    if (!imageUrl || !fileName) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = fileName;
    a.click();
  };

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("imgToBase64Title")} description={t("imgToBase64Desc")} />

      <div className="flex flex-1 flex-col gap-4">
        <FileDropZone onFile={handleFile} onError={(msg) => toast.error(msg)} />

        {imageUrl && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
              <Label className="text-sm font-medium">{fileName}</Label>
              <img
                src={imageUrl}
                alt="preview"
                className="max-h-[300px] rounded-md object-contain"
              />
            </div>

            <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
              <Label className="text-sm font-medium">{t("imgToBase64Result")}</Label>
              <Textarea
                value={base64}
                readOnly
                className="min-h-[200px] flex-1 resize-y bg-muted font-mono text-xs"
              />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  {t("imgToBase64Copy")}
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  {t("imgToBase64Download")}
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("clear")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
