"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Download,
  FileCode,
  Maximize,
  Minimize,
  Trash2,
} from "lucide-react";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const DEFAULT_MARKDOWN = `# 标题\n\n这是一段 **粗体** 和 *斜体* 文字。\n\n- 列表项 1\n- 列表项 2\n- 列表项 3\n\n\`\`\`js\nconsole.log("Hello Markdown");\n\`\`\`\n`;

export default function MarkdownPage() {
  const { t } = useI18n();
  const [input, setInput] = useState(DEFAULT_MARKDOWN);

  // 全屏：优先使用浏览器 Fullscreen API，失败时降级为 fixed 覆盖层
  const containerRef = useRef<HTMLDivElement>(null);
  const [apiFullscreen, setApiFullscreen] = useState(false);
  const [cssFullscreen, setCssFullscreen] = useState(false);
  const isFullscreen = apiFullscreen || cssFullscreen;

  useEffect(() => {
    const onChange = () =>
      setApiFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // CSS 降级模式下支持 ESC 退出
  useEffect(() => {
    if (!cssFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCssFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cssFullscreen]);

  const toggleFullscreen = useCallback(async () => {
    if (apiFullscreen) {
      await document.exitFullscreen().catch(() => {});
      return;
    }
    if (cssFullscreen) {
      setCssFullscreen(false);
      return;
    }
    const el = containerRef.current;
    if (el && document.fullscreenEnabled) {
      try {
        await el.requestFullscreen();
        return; // 状态由 fullscreenchange 事件同步
      } catch {
        // 继续走 CSS 降级
      }
    }
    setCssFullscreen(true);
  }, [apiFullscreen, cssFullscreen]);

  const html = useMemo(() => {
    const raw = marked.parse(input, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [input]);

  const copyHtml = async () => {
    await navigator.clipboard.writeText(html);
    toast.success(t("copied"));
  };

  const exportHtml = () => {
    const blob = new Blob(
      [
        `<!DOCTYPE html>\n<html lang="${t("langZh") === "中文" ? "zh-CN" : "en"}">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Markdown Export</title>\n<style>\nbody{font-family:system-ui,-apple-system,sans-serif;max-width:768px;margin:0 auto;padding:24px;line-height:1.6;color:#333}\npre{background:#f4f4f4;padding:12px;border-radius:6px;overflow:auto}\ncode{font-family:monospace;background:#f4f4f4;padding:2px 4px;border-radius:3px}\nblockquote{border-left:4px solid #ddd;margin:0;padding-left:16px;color:#666}\ntable{border-collapse:collapse;width:100%}\nth,td{border:1px solid #ddd;padding:8px;text-align:left}\nth{background:#f4f4f4}\nimg{max-width:100%}\n</style>\n</head>\n<body>\n${html}\n</body>\n</html>`,
      ],
      { type: "text/html" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `markdown-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(t("markdownExportHtml"));
  };

  const clear = () => setInput("");

  return (
    <ToolLayout
      maxWidth="max-w-none"
      className="lg:h-[calc(100vh-3.5rem)] lg:h-[calc(100dvh-3.5rem)]"
    >
      <PageHeader title={t("markdownTitle")} description={t("markdownDesc")} />

      <div
        ref={containerRef}
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-4 [&:fullscreen]:bg-background [&:fullscreen]:p-4",
          cssFullscreen && "fixed inset-0 z-50 overflow-auto bg-background p-4"
        )}
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={clear}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("clear")}
          </Button>
          <Button variant="outline" onClick={copyHtml}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copy")} HTML
          </Button>
          <Button onClick={exportHtml}>
            <Download className="mr-2 h-4 w-4" />
            {t("markdownExportHtml")}
          </Button>
          <Button
            variant="outline"
            onClick={toggleFullscreen}
            className="ml-auto"
          >
            {isFullscreen ? (
              <Minimize className="mr-2 h-4 w-4" />
            ) : (
              <Maximize className="mr-2 h-4 w-4" />
            )}
            {isFullscreen ? t("exitFullscreen") : t("fullscreen")}
          </Button>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
          <div className="flex min-h-0 flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="markdown-input">{t("markdownInput")}</Label>
            </div>
            <Textarea
              id="markdown-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("markdownInputPlaceholder")}
              className="min-h-[40vh] flex-1 resize-none font-mono text-sm lg:min-h-0"
            />
          </div>

          <div className="flex min-h-0 flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
            <Label>{t("markdownPreview")}</Label>
            <div
              className="min-h-[40vh] flex-1 overflow-auto rounded-md border bg-background p-4 prose prose-sm max-w-none dark:prose-invert lg:min-h-0"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
