"use client";

import { useState, useRef } from "react";
import { Loader2, Copy, Trash2, ScanText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileDropZone } from "@/components/file-drop-zone";
import { toast } from "sonner";
import Tesseract from "tesseract.js";
import { useI18n } from "@/lib/i18n";

const LANGS = [
  { value: "chi_sim+eng", labelKey: "ocrLangChiSimEng" },
  { value: "eng", labelKey: "ocrLangEng" },
  { value: "chi_sim", labelKey: "ocrLangChiSim" },
  { value: "chi_tra", labelKey: "ocrLangChiTra" },
];

export default function OcrPage() {
  const { t } = useI18n();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lang, setLang] = useState("chi_sim+eng");
  const fileRef = useRef<File | null>(null);

  const handleFile = (file: File) => {
    fileRef.current = file;
    setImageUrl(URL.createObjectURL(file));
    setText("");
    setProgress(0);
  };

  const recognize = async () => {
    if (!imageUrl || !fileRef.current) {
      toast.warning(t("ocrPleaseUpload"));
      return;
    }
    setLoading(true);
    setText("");
    try {
      const result = await Tesseract.recognize(fileRef.current, lang, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      setText(result.data.text);
      toast.success(t("ocrSuccess"));
    } catch (error) {
      toast.error(t("ocrError"));
      console.error(error);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  const clear = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setText("");
    setProgress(0);
    fileRef.current = null;
  };

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader
        title={t("ocrTitle")}
        description={t("ocrDesc")}
      />

      <div className="flex flex-1 flex-col gap-6">
        <Alert variant="default" className="bg-muted">
          <ScanText className="h-4 w-4" />
          <AlertDescription>{t("ocrNotice")}</AlertDescription>
        </Alert>

        <FileDropZone onFile={handleFile} maxSize={4 * 1024 * 1024} />

        {imageUrl && (
          <div className="flex flex-1 flex-col gap-4">
            <div className="overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={t("ocrImageAlt")}
                className="max-h-[300px] w-full object-contain"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {LANGS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {t(l.labelKey as never)}
                  </option>
                ))}
              </select>
              <Button onClick={recognize} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ScanText className="mr-2 h-4 w-4" />
                )}
                {loading ? `${t("ocrRecognizing")} ${progress}%` : t("ocrStart")}
              </Button>
              <Button variant="outline" onClick={copy} disabled={!text}>
                <Copy className="mr-2 h-4 w-4" />
                {t("copy")}
              </Button>
              <Button variant="outline" onClick={clear}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t("clear")}
              </Button>
            </div>

            <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("ocrResultPlaceholder")}
                className="min-h-[40vh] flex-1 resize-y md:min-h-[400px]"
              />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
