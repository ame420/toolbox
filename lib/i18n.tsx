"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Lang, type TranslationKey } from "./i18n-data";

const LANG_KEY = "toolbox-lang";

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem(LANG_KEY) as Lang | null;
  return saved === "zh" || saved === "en" ? saved : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // After hydration, restore the saved language from localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangState(getInitialLang());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
      localStorage.setItem(LANG_KEY, lang);
    }
  }, [lang, mounted]);

  const setLang = (next: Lang) => setLangState(next);

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    const value = (translations[lang][key] ?? translations.zh[key] ?? key) as string;
    if (!params) return value;
    return Object.entries(params).reduce<string>(
      (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
      value
    );
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
