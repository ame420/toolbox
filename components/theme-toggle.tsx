"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Palette } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

const THEMES = [
  { id: "light", labelKey: "themeLight" },
  { id: "dark", labelKey: "themeDark" },
  { id: "theme-blue", labelKey: "themeBlue" },
  { id: "theme-green", labelKey: "themeGreen" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This is the standard React pattern to avoid hydration mismatch
    // when rendering theme-dependent UI with next-themes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Avoid hydration mismatch: render the default theme during SSR/initial
  // hydration, then switch to the resolved theme after mount.
  const current = (mounted ? (theme as ThemeId) : "light") ?? "light";

  const handleChange = (id: ThemeId) => {
    // next-themes may leave stale custom theme classes on the root element
    // when switching back to the default theme, so clean them up manually.
    const root = document.documentElement;
    THEMES.forEach(({ id }) => root.classList.remove(id));
    setTheme(id);
  };

  return (
    <Select value={current} onValueChange={(v) => handleChange(v as ThemeId)}>
      <SelectTrigger
        aria-label={t("theme")}
        className="h-8 w-auto gap-1.5 border-none bg-transparent px-2 hover:bg-accent"
      >
        <Palette className="h-4 w-4" />
        <SelectValue placeholder={t("theme")} />
      </SelectTrigger>
      <SelectContent align="end">
        {THEMES.map(({ id, labelKey }) => (
          <SelectItem key={id} value={id}>
            <span className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>{t(labelKey as never)}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
