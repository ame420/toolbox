"use client";

import { useMemo, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

function base64UrlDecode(input: string): string {
  const padding = "=".repeat((4 - (input.length % 4)) % 4);
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + padding;
  try {
    return decodeURIComponent(
      escape(atob(base64))
    );
  } catch {
    return "";
  }
}

interface DecodedJwt {
  header: string;
  payload: string;
  signature: string;
  valid: boolean;
}

export default function JwtPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");

  const decoded: DecodedJwt = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { header: "", payload: "", signature: "", valid: false };
    const parts = trimmed.split(".");
    if (parts.length !== 3) return { header: "", payload: "", signature: "", valid: false };
    const header = base64UrlDecode(parts[0]);
    const payload = base64UrlDecode(parts[1]);
    return {
      header,
      payload,
      signature: parts[2],
      valid: Boolean(header && payload),
    };
  }, [input]);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  const clear = () => {
    setInput("");
  };

  const formatJson = (text: string) => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  };

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("jwtTitle")} description={t("jwtDesc")} />

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="jwt-input">{t("jwtInput")}</Label>
            <Button variant="outline" size="sm" onClick={clear}>
              <Trash2 className="mr-1 h-4 w-4" />
              {t("clear")}
            </Button>
          </div>
          <Textarea
            id="jwt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("jwtInputPlaceholder")}
            className="min-h-32 font-mono text-sm"
          />
          {input && !decoded.valid && (
            <p className="text-sm text-destructive">{t("jwtInvalid")}</p>
          )}
        </div>

        {decoded.valid && (
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { label: t("jwtHeader"), value: formatJson(decoded.header) },
              { label: t("jwtPayload"), value: formatJson(decoded.payload) },
              { label: t("jwtSignature"), value: decoded.signature },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium">{label}</h3>
                  <Button variant="outline" size="sm" onClick={() => copy(value)}>
                    <Copy className="mr-1 h-4 w-4" />
                    {t("copy")}
                  </Button>
                </div>
                <pre className="max-h-80 overflow-auto rounded-md bg-muted p-3 font-mono text-xs break-words whitespace-pre-wrap">
                  {value}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
