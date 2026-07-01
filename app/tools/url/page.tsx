"use client";

import { useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export default function UrlPage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"encode" | "decode" | "parse">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [fullEncode, setFullEncode] = useState(true);
  const [parsed, setParsed] = useState<{
    protocol: string;
    host: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    origin: string;
    href: string;
    params: [string, string][];
  } | null>(null);

  const process = () => {
    if (!input) {
      toast.warning(t("pleaseInput"));
      return;
    }

    if (mode === "encode") {
      try {
        setOutput(fullEncode ? encodeURIComponent(input) : encodeURI(input));
        toast.success(t("success"));
      } catch {
        toast.error(t("error"));
      }
    } else if (mode === "decode") {
      try {
        setOutput(fullEncode ? decodeURIComponent(input) : decodeURI(input));
        toast.success(t("success"));
      } catch {
        toast.error(t("error"));
      }
    } else {
      try {
        const url = new URL(input);
        const params: [string, string][] = [];
        url.searchParams.forEach((value, key) => {
          params.push([key, value]);
        });
        setParsed({
          protocol: url.protocol,
          host: url.host,
          port: url.port,
          pathname: url.pathname,
          search: url.search,
          hash: url.hash,
          origin: url.origin,
          href: url.href,
          params,
        });
        toast.success(t("success"));
      } catch {
        toast.error(t("urlInvalid"));
        setParsed(null);
      }
    }
  };

  const handleCopy = async () => {
    const text = mode === "parse" ? input : output;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setParsed(null);
  };

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("urlTitle")} description={t("urlDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            onClick={() => {
              setMode("encode");
              setOutput("");
              setParsed(null);
            }}
          >
            {t("urlEncode")}
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            onClick={() => {
              setMode("decode");
              setOutput("");
              setParsed(null);
            }}
          >
            {t("urlDecode")}
          </Button>
          <Button
            variant={mode === "parse" ? "default" : "outline"}
            onClick={() => {
              setMode("parse");
              setOutput("");
              setParsed(null);
            }}
          >
            {t("urlParse")}
          </Button>

          {mode !== "parse" && (
            <div className="flex items-center gap-2">
              <Switch
                id="full-encode"
                checked={fullEncode}
                onCheckedChange={setFullEncode}
              />
              <Label htmlFor="full-encode" className="text-sm">
                {fullEncode ? t("urlFullEncode") : t("urlPartialEncode")}
              </Label>
            </div>
          )}

          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={handleCopy} disabled={!input && !output}>
              <Copy className="mr-2 h-4 w-4" />
              {t("copy")}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t("clear")}
            </Button>
          </div>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <Label className="text-sm font-medium">{t("urlInput")}</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "parse" ? "https://example.com/path?query=1" : t("pleaseInput")}
              className="min-h-[40vh] flex-1 resize-y font-mono text-sm md:min-h-[480px]"
            />
          </div>

          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <Label className="text-sm font-medium">{t("urlOutput")}</Label>
            {mode === "parse" ? (
              parsed ? (
                <div className="flex flex-col gap-3 overflow-auto">
                  <ParsedRow label={t("urlProtocol")} value={parsed.protocol} />
                  <ParsedRow label={t("urlHost")} value={parsed.host} />
                  {parsed.port && <ParsedRow label={t("urlPort")} value={parsed.port} />}
                  <ParsedRow label={t("urlPath")} value={parsed.pathname || "/"} />
                  {parsed.search && <ParsedRow label={t("urlQuery")} value={parsed.search} />}
                  {parsed.params.length > 0 && (
                    <div className="rounded-lg border p-3">
                      <p className="mb-2 text-sm font-medium text-muted-foreground">{t("urlQuery")}</p>
                      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                        {parsed.params.map(([key, value]) => (
                          <div key={key} className="contents">
                            <dt className="font-mono text-muted-foreground">{key}</dt>
                            <dd className="break-all font-mono">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                  {parsed.hash && <ParsedRow label={t("urlHash")} value={parsed.hash} />}
                  <ParsedRow label={t("urlOrigin")} value={parsed.origin} />
                  <ParsedRow label={"URL"} value={parsed.href} />
                </div>
              ) : (
                <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground md:min-h-[480px]">
                  {t("urlInvalid")}
                </div>
              )
            ) : (
              <Textarea
                value={output}
                readOnly
                placeholder={t("urlOutput")}
                className="min-h-[40vh] flex-1 resize-y bg-muted font-mono text-sm md:min-h-[480px]"
              />
            )}
          </div>
        </div>

        <Button onClick={process} className="w-full md:w-auto">
          {mode === "encode" ? t("urlEncode") : mode === "decode" ? t("urlDecode") : t("urlParse")}
        </Button>
      </div>
    </ToolLayout>
  );
}

function ParsedRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border p-3 sm:flex-row sm:items-start sm:gap-3">
      <span className="min-w-[4rem] text-sm font-medium text-muted-foreground">{label}</span>
      <span className="break-all font-mono text-sm">{value}</span>
    </div>
  );
}
