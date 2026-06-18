"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();

  const toggle = () => {
    setLang(lang === "zh" ? "en" : "zh");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={t("language")}
      className="gap-1.5"
    >
      <Globe className="h-4 w-4" />
      <span className="min-w-[2ch]">{lang === "zh" ? "EN" : "中文"}</span>
    </Button>
  );
}
