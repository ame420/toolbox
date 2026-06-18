"use client";

import { useState, useEffect } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const formatDate = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
};

export default function TimestampPage() {
  const { t } = useI18n();
  const [timestamp, setTimestamp] = useState("");
  const [dateString, setDateString] = useState("");
  const [now, setNow] = useState(0);

  useEffect(() => {
    const init = () => {
      const seconds = Math.floor(Date.now() / 1000);
      setTimestamp(String(seconds));
      setDateString(formatDate(new Date()));
      setNow(Date.now());
    };
    init();
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const convertTimestamp = () => {
    const ts = Number(timestamp);
    if (Number.isNaN(ts)) {
      toast.error(t("timestampInvalid"));
      return;
    }
    const date = new Date(ts > 9999999999 ? ts : ts * 1000);
    if (Number.isNaN(date.getTime())) {
      toast.error(t("timestampInvalidDate"));
      return;
    }
    setDateString(formatDate(date));
    toast.success(t("success"));
  };

  const convertDate = () => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      toast.error(t("timestampInvalidDate"));
      return;
    }
    setTimestamp(String(Math.floor(date.getTime() / 1000)));
    toast.success(t("success"));
  };

  const useNow = () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    setTimestamp(String(nowSeconds));
    setDateString(formatDate(new Date()));
    toast.success(t("timestampFilled"));
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  return (
    <ToolLayout maxWidth="max-w-4xl">
      <PageHeader
        title={t("timestampTitle")}
        description={t("timestampDesc")}
      />

      <div className="space-y-8">
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("timestampCurrent")}</h2>
            <Button variant="outline" size="sm" onClick={useNow}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("timestampUseNow")}
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">{t("timestampUnix")}</Label>
              <div className="mt-1 text-2xl font-mono font-semibold">
                {Math.floor(now / 1000)}
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">{t("timestampBeijing")}</Label>
              <div className="mt-1 text-lg font-mono">
                {formatDate(new Date(now))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border bg-card p-4">
            <Label htmlFor="timestamp">{t("timestampUnix")}</Label>
            <div className="flex gap-2">
              <Input
                id="timestamp"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder={t("timestampPlaceholder")}
                className="font-mono"
              />
              <Button variant="ghost" size="icon" onClick={() => copy(timestamp)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={convertTimestamp}>{t("timestampToDate")}</Button>
          </div>

          <div className="space-y-3 rounded-lg border bg-card p-4">
            <Label htmlFor="datetime">{t("timestampBeijing")}</Label>
            <div className="flex gap-2">
              <Input
                id="datetime"
                type="datetime-local"
                value={dateString}
                onChange={(e) => setDateString(e.target.value)}
                className="font-mono"
              />
              <Button variant="ghost" size="icon" onClick={() => copy(dateString)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={convertDate}>{t("timestampToTimestamp")}</Button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
