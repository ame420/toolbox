"use client";

import { useState } from "react";
import { Send, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";

interface Header {
  key: string;
  value: string;
}

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export default function ApiRequestPage() {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState<Header[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    headers: string;
    body: string;
  } | null>(null);
  const [error, setError] = useState("");

  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const removeHeader = (i: number) => {
    if (headers.length <= 1) return;
    setHeaders(headers.filter((_, idx) => idx !== i));
  };
  const updateHeader = (i: number, field: "key" | "value", val: string) => {
    const h = [...headers];
    h[i][field] = val;
    setHeaders(h);
  };

  const sendRequest = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const h = new Headers();
      headers.forEach(({ key, value }) => {
        if (key.trim()) h.append(key.trim(), value);
      });

      const opts: RequestInit = { method, headers: h };
      if (["POST", "PUT", "PATCH"].includes(method) && body) {
        opts.body = body;
      }

      const start = performance.now();
      const res = await fetch(url, opts);
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => { resHeaders[k] = v; });

      let resBody: string;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const json = await res.json();
        resBody = JSON.stringify(json, null, 2);
      } else {
        resBody = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: JSON.stringify(resHeaders, null, 2),
        body: resBody,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout maxWidth="max-w-6xl">
      <PageHeader
        title={t("apiTitle")}
        description={t("apiDesc")}
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm font-mono"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("apiUrlPlaceholder")}
            className="flex-1 font-mono text-sm"
          />
          <Button onClick={sendRequest} disabled={loading || !url.trim()}>
            <Send className="mr-2 h-4 w-4" />
            {loading ? t("apiSending") : t("apiSend")}
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">{t("apiHeaders")}</h3>
            <Button variant="outline" size="sm" onClick={addHeader}>
              <Plus className="mr-1 h-3 w-3" />{t("apiAddHeader")}
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {headers.map((h, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={h.key}
                  onChange={(e) => updateHeader(i, "key", e.target.value)}
                  placeholder={t("apiHeaderKey")}
                  className="flex-1 font-mono text-xs"
                />
                <Input
                  value={h.value}
                  onChange={(e) => updateHeader(i, "value", e.target.value)}
                  placeholder={t("apiHeaderValue")}
                  className="flex-[2] font-mono text-xs"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHeader(i)}
                  disabled={headers.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {["POST", "PUT", "PATCH"].includes(method) && (
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("apiBodyPlaceholder")}
            className="min-h-[120px] font-mono text-sm"
          />
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {response && (
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b px-4 py-2">
              <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold ${
                response.status < 300
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {response.status} {response.statusText}
              </span>
            </div>
            <details className="border-b">
              <summary className="cursor-pointer px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                {t("apiResponseHeaders")}
              </summary>
              <pre className="overflow-x-auto px-4 pb-3 text-xs text-muted-foreground">
                {response.headers}
              </pre>
            </details>
            <div className="overflow-x-auto p-4">
              <pre className="text-sm leading-relaxed">{response.body}</pre>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
