"use client";

import { useMemo, useState } from "react";
import { Copy, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { HTTP_STATUS, CATEGORY_LABELS, type HttpStatus } from "@/lib/http-status";

const CATEGORIES: HttpStatus["category"][] = [
  "informational",
  "success",
  "redirection",
  "clientError",
  "serverError",
];

const CATEGORY_COLORS: Record<HttpStatus["category"], string> = {
  informational: "bg-blue-500",
  success: "bg-green-500",
  redirection: "bg-yellow-500",
  clientError: "bg-orange-500",
  serverError: "bg-red-500",
};

export default function HttpStatusPage() {
  const { t, lang } = useI18n();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<HttpStatus["category"] | "all">("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return HTTP_STATUS.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        !term ||
        String(item.code).includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const handleCopy = async (item: HttpStatus) => {
    await navigator.clipboard.writeText(`${item.code} ${item.name}`);
    toast.success(t("copied"));
  };

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("httpStatusTitle")} description={t("httpStatusDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("httpStatusSearch")}
              className="pl-9"
            />
          </div>

          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as HttpStatus["category"] | "all")}>
            <TabsList className="flex flex-wrap justify-start">
              <TabsTrigger value="all">{lang === "zh" ? "全部" : "All"}</TabsTrigger>
              {CATEGORIES.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {CATEGORY_LABELS[cat][lang]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.code}
              className="group relative rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl font-bold tabular-nums">{item.code}</span>
                <Badge className={CATEGORY_COLORS[item.category]}>
                  {CATEGORY_LABELS[item.category][lang]}
                </Badge>
              </div>
              <p className="font-medium">{item.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              <Button
                variant="ghost"
                size="icon-xs"
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleCopy(item)}
                aria-label={t("copy")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">{lang === "zh" ? "无匹配结果" : "No matches"}</div>
        )}
      </div>
    </ToolLayout>
  );
}
