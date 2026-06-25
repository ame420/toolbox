"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Globe, MapPin, Building, Flag } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface IpInfo {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export default function IpInfoPage() {
  const { t } = useI18n();
  const [data, setData] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIpInfo = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://ip-api.com/json/?fields=66842623");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      if (json.status === "fail") throw new Error(json.message || t("ipError"));
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIpInfo(); }, []);

  const rows = data ? [
    { icon: Globe, label: t("ipAddress"), value: data.query },
    { icon: Flag, label: t("ipCountry"), value: `${data.country} (${data.countryCode})` },
    { icon: MapPin, label: t("ipRegion"), value: `${data.city}, ${data.regionName} (${data.region})` },
    { icon: Globe, label: t("ipCoord"), value: `${data.lat}, ${data.lon}` },
    { icon: Globe, label: t("ipTimezone"), value: data.timezone },
    { icon: Building, label: t("ipIsp"), value: data.isp || "-" },
    { icon: Building, label: t("ipOrg"), value: data.org || "-" },
    { icon: Building, label: t("ipAs"), value: data.as || "-" },
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
