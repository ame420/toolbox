"use client";

import { Copy } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { SCREEN_CATEGORIES } from "@/lib/screen-sizes";

export default function ScreenSizesPage() {
  const { t } = useI18n();

  const handleCopy = async (resolution: string) => {
    await navigator.clipboard.writeText(resolution);
    toast.success(t("copied"));
  };

  const categoryNames: Record<string, string> = {
    phone: t("screenSizesPhone"),
    tablet: t("screenSizesTablet"),
    laptop: t("screenSizesLaptop"),
    desktop: t("screenSizesDesktop"),
    wearable: t("screenSizesWearable"),
  };

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("screenSizesTitle")} description={t("screenSizesDesc")} />

      <Tabs defaultValue="phone">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {SCREEN_CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {categoryNames[cat.id]}
            </TabsTrigger>
          ))}
        </TabsList>

        {SCREEN_CATEGORIES.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">{t("screenSizesDevice")}</th>
                    <th className="px-4 py-2 text-left">{t("screenSizesResolution")}</th>
                    <th className="px-4 py-2 text-left">{t("screenSizesDpi")}</th>
                    <th className="px-4 py-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cat.devices.map((device) => (
                    <tr key={device.name} className="even:bg-muted/50">
                      <td className="px-4 py-2 font-medium">{device.name}</td>
                      <td className="px-4 py-2 font-mono">{device.resolution}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {device.dpi ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleCopy(device.resolution)}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <Copy className="h-3 w-3" />
                          {t("screenSizesCopy")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </ToolLayout>
  );
}
