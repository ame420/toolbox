"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Globe, MapPin, Building, Flag } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const CACHE_KEY = "toolbox_ip_info";
const CACHE_TTL = 3600000;

function getCached(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function setCached(data: Record<string, unknown>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* ignore */ }
}

export default function IpInfoPage() {
  const { t } = useI18n();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIpInfo = async () => {
    setLoading(true);
    setError("");

    const cached = getCached();
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    const apis = [
      "https://ipapi.co/json/",
      "https://ipwho.is/",
    ];

    for (const url of apis) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const json = await res.json();
        if (json.error) continue;
        if (url.includes("ipwho") && !json.success) continue;
        setData(json);
        setCached(json);
        setLoading(false);
        return;
      } catch { /* try next */ }
    }

    setError(t("ipError"));
    setLoading(false);
  };

  useEffect(() => { fetchIpInfo(); }, []);

  const getNested = (obj: unknown, path: string): string | undefined => {
    try {
      let cur = obj as Record<string, unknown>;
      for (const key of path.split(".")) {
        if (!cur || typeof cur !== "object") return undefined;
        cur = cur[key] as Record<string, unknown>;
      }
      return typeof cur === "string" ? cur : undefined;
    } catch { return undefined; }
  };

  const rows = data ? [
    { icon: Globe, label: t("ipAddress"), value: (data.ip || data.query || "") as string },
    { icon: Flag, label: t("ipCountry"), value: `${data.country || data.country_name} (${data.country_code || data.countryCode})` },
    { icon: MapPin, label: t("ipRegion"), value: `${data.city || ""}, ${data.region || data.regionName || ""}` },
    { icon: Globe, label: t("ipCoord"), value: `${data.latitude || data.lat}, ${data.longitude || data.lon}` },
    { icon: Globe, label: t("ipTimezone"), value: (data.timezone as string) || getNested(data, "timezone.id") || "-" },
    { icon: Building, label: t("ipIsp"), value: (data.org as string) || getNested(data, "connection.isp") || "-" },
    { icon: Building, label: t("ipOrg"), value: (data.org as string) || getNested(data, "connection.org") || "-" },
    { icon: Building, label: t("ipAs"), value: (data.asn as string) || getNested(data, "connection.asn") || "-" },
  ] : [];

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader
        title={t("ipTitle")}
        description={t("ipDesc")}
      />

      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          className="self-start"
          onClick={fetchIpInfo}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {t("ipRefresh")}
        </Button>

        {loading && !data && (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            {t("ipLoading")}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {data && (
          <div className="rounded-lg border bg-card shadow-sm">
            {rows.map((row, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-4 py-3 ${
                  i < rows.length - 1 ? "border-b" : ""
                }`}
              >
                <row.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="w-28 text-sm font-medium text-muted-foreground">
                  {row.label}
                </span>
                <span className="text-sm">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
