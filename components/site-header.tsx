"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { useI18n } from "@/lib/i18n";

const GITHUB_URL = "https://github.com/ame420/toolbox";
const AVATAR_URL = "https://github.com/ame420.png";

export function SiteHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" />
          </div>
          <span className="hidden text-base sm:inline">{t("siteName")}</span>
        </Link>

        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-background transition-colors hover:bg-accent"
            aria-label="GitHub"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AVATAR_URL}
              alt="GitHub"
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
