"use client";

import { useMemo, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface DiffLine {
  type: "same" | "add" | "remove";
  value: string;
}

function diffLines(a: string, b: string): DiffLine[] {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const m = aLines.length;
  const n = bLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (aLines[i - 1] === bLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.unshift({ type: "same", value: aLines[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "add", value: bLines[j - 1] });
      j--;
    } else {
      result.unshift({ type: "remove", value: aLines[i - 1] });
      i--;
    }
  }
  return result;
}

function formatDiff(lines: DiffLine[]): string {
  return lines
    .map((line) => {
      const prefix = line.type === "add" ? "+ " : line.type === "remove" ? "- " : "  ";
      return prefix + line.value;
    })
    .join("\n");
}

export default function DiffPage() {
  const { t } = useI18n();
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");

  const diff = useMemo(() => diffLines(original, modified), [original, modified]);

  const copy = async () => {
    await navigator.clipboard.writeText(formatDiff(diff));
    toast.success(t("copied"));
  };

  const clear = () => {
    setOriginal("");
    setModified("");
  };

  return (
    <ToolLayout maxWidth="max-w-6xl">
      <PageHeader title={t("diffTitle")} description={t("diffDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="grid flex-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <Label htmlFor="diff-original">{t("diffOriginal")}</Label>
            <Textarea
              id="diff-original"
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder={t("diffOriginalPlaceholder")}
              className="min-h-[30vh] flex-1 resize-y font-mono text-sm md:min-h-[360px]"
            />
          </div>

          <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <Label htmlFor="diff-modified">{t("diffModified")}</Label>
            <Textarea
              id="diff-modified"
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder={t("diffModifiedPlaceholder")}
              className="min-h-[30vh] flex-1 resize-y font-mono text-sm md:min-h-[360px]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={clear}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("clear")}
          </Button>
          <Button onClick={copy} disabled={diff.length === 0}>
            <Copy className="mr-2 h-4 w-4" />
            {t("diffCopy")}
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-medium">{t("preview")}</h3>
          {diff.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("diffNoDiff")}</p>
          ) : (
            <div className="overflow-auto rounded-md border">
              <table className="w-full text-left font-mono text-sm">
                <tbody>
                  {diff.map((line, index) => (
                    <tr
                      key={index}
                      className={cn(
                        line.type === "add" && "bg-green-500/10 text-green-700 dark:text-green-400",
                        line.type === "remove" && "bg-red-500/10 text-red-700 dark:text-red-400"
                      )}
                    >
                      <td className="w-8 select-none border-r px-2 py-1 text-center text-muted-foreground">
                        {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                      </td>
                      <td className="px-3 py-1 whitespace-pre-wrap break-words">{line.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
