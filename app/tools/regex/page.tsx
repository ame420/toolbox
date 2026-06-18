"use client";

import { useMemo, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface RegexMatch {
  text: string;
  index: number;
  groups: string[];
}

interface RegexResult {
  regexp: RegExp | null;
  matches: RegexMatch[];
  error: string | null;
  replaced: string;
}

const FLAGS = [
  { key: "g", labelKey: "regexFlagG" },
  { key: "i", labelKey: "regexFlagI" },
  { key: "m", labelKey: "regexFlagM" },
  { key: "s", labelKey: "regexFlagS" },
] as const;

export default function RegexPage() {
  const { t } = useI18n();
  const [pattern, setPattern] = useState("");
  const [flagState, setFlagState] = useState({ g: true, i: false, m: false, s: false });
  const [testText, setTestText] = useState("");
  const [replacement, setReplacement] = useState("");

  const flags = useMemo(
    () =>
      (Object.keys(flagState) as Array<keyof typeof flagState>)
        .filter((k) => flagState[k])
        .join(""),
    [flagState]
  );

  const result: RegexResult = useMemo(() => {
    if (!pattern) {
      return { regexp: null, matches: [], error: null, replaced: testText };
    }
    let regexp: RegExp;
    try {
      regexp = new RegExp(pattern, flags);
    } catch {
      return { regexp: null, matches: [], error: t("regexInvalid"), replaced: testText };
    }

    const matches: RegexMatch[] = [];
    if (flags.includes("g")) {
      let m: RegExpExecArray | null;
      // Avoid infinite loops on zero-width matches.
      let lastIndex = -1;
      while ((m = regexp.exec(testText)) !== null) {
        if (m.index === lastIndex && m[0].length === 0) {
          regexp.lastIndex++;
          continue;
        }
        lastIndex = m.index;
        matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
      }
    } else {
      const m = regexp.exec(testText);
      if (m) {
        matches.push({ text: m[0], index: m.index, groups: m.slice(1) });
      }
    }

    let replaced = testText;
    try {
      replaced = testText.replace(regexp, replacement);
    } catch {
      replaced = testText;
    }

    return { regexp, matches, error: null, replaced };
  }, [pattern, flags, testText, replacement, t]);

  const highlighted = useMemo(() => {
    if (!result.regexp || result.matches.length === 0) return null;
    const parts: React.ReactNode[] = [];
    let last = 0;
    for (const match of result.matches) {
      if (match.index > last) {
        parts.push(
          <span key={`${match.index}-pre`}>{testText.slice(last, match.index)}</span>
        );
      }
      parts.push(
        <mark
          key={`${match.index}-match`}
          className="rounded-sm bg-primary px-0.5 text-primary-foreground"
        >
          {match.text}
        </mark>
      );
      last = match.index + match.text.length;
    }
    if (last < testText.length) {
      parts.push(<span key="tail">{testText.slice(last)}</span>);
    }
    return parts;
  }, [result.matches, result.regexp, testText]);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  const clear = () => {
    setPattern("");
    setTestText("");
    setReplacement("");
  };

  return (
    <ToolLayout maxWidth="max-w-6xl">
      <PageHeader title={t("regexTitle")} description={t("regexDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <Label htmlFor="regex-pattern">{t("regexPattern")}</Label>
            <Input
              id="regex-pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t("regexPatternPlaceholder")}
              className="font-mono"
            />
            {result.error && (
              <p className="text-sm text-destructive">{result.error}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("regexFlags")}</Label>
            <div className="flex flex-wrap gap-4">
              {FLAGS.map(({ key, labelKey }) => (
                <Label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 text-sm font-normal"
                >
                  <Switch
                    checked={flagState[key as keyof typeof flagState]}
                    onCheckedChange={(checked) =>
                      setFlagState((prev) => ({ ...prev, [key]: checked }))
                    }
                  />
                  {t(labelKey as never)}
                </Label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Label htmlFor="regex-text">{t("regexTestText")}</Label>
              <Button variant="outline" size="sm" onClick={clear}>
                <Trash2 className="mr-1 h-4 w-4" />
                {t("clear")}
              </Button>
            </div>
            <Textarea
              id="regex-text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder={t("regexTestTextPlaceholder")}
              className="min-h-[24vh] flex-1 resize-y font-mono text-sm md:min-h-[280px]"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-1 flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
              <Label>{t("regexMatches")}</Label>
              <div className="min-h-[12vh] flex-1 overflow-auto rounded-md border bg-muted p-3 md:min-h-[120px]">
                {highlighted ? (
                  <pre className="whitespace-pre-wrap break-words font-mono text-sm">
                    {highlighted}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {pattern ? t("regexNoMatches") : t("regexTestTextPlaceholder")}
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {pattern
                  ? t("regexMatchCount", { count: result.matches.length })
                  : ""}
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
              <Label htmlFor="regex-replacement">{t("regexReplacement")}</Label>
              <Input
                id="regex-replacement"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                placeholder={t("regexReplacementPlaceholder")}
                className="font-mono"
              />
              <div className="mt-1 flex items-center justify-between gap-2">
                <pre className="max-w-full truncate font-mono text-sm text-muted-foreground">
                  {result.replaced || t("preview")}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copy(result.replaced)}
                  disabled={!result.replaced}
                >
                  <Copy className="mr-1 h-4 w-4" />
                  {t("copy")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
