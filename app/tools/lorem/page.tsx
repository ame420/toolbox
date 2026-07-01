"use client";

import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit",
  "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur",
];

const CHINESE_WORDS = [
  "春天", "夏天", "秋天", "冬天", "阳光", "微风", "细雨", "白雪", "山川", "河流",
  "森林", "海洋", "城市", "乡村", "道路", "桥梁", "书本", "音乐", "梦想", "希望",
  "友谊", "爱情", "家庭", "工作", "学习", "旅行", "美食", "咖啡", "茶香", "花香",
  "时光", "岁月", "记忆", "未来", "世界", "生活", "故事", "诗篇", "画卷", "旋律",
];

function generateText(paragraphs: number, wordsPerParagraph: number, chinese: boolean): string {
  const wordPool = chinese ? CHINESE_WORDS : LOREM_WORDS;
  const result: string[] = [];

  for (let p = 0; p < paragraphs; p += 1) {
    const words: string[] = [];
    for (let i = 0; i < wordsPerParagraph; i += 1) {
      words.push(wordPool[Math.floor(Math.random() * wordPool.length)]);
    }
    let sentence = words.join(chinese ? "" : " ");
    if (!chinese) {
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    } else {
      sentence += "。";
    }
    result.push(sentence);
  }

  return result.join("\n\n");
}

export default function LoremPage() {
  const { t } = useI18n();
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [output, setOutput] = useState("");

  const generate = () => {
    setOutput(generateText(paragraphs, wordsPerParagraph, language === "zh"));
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success(t("copied"));
  };

  return (
    <ToolLayout maxWidth="max-w-4xl">
      <PageHeader title={t("loremTitle")} description={t("loremDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="grid gap-4 rounded-lg border bg-card p-4 shadow-sm sm:grid-cols-3">
          <div className="space-y-2">
            <Label>{t("loremParagraphs")}: {paragraphs}</Label>
            <Slider
              value={[paragraphs]}
              onValueChange={(v) => setParagraphs(Array.isArray(v) ? v[0] : v)}
              min={1}
              max={20}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("loremWordsPerParagraph")}: {wordsPerParagraph}</Label>
            <Slider
              value={[wordsPerParagraph]}
              onValueChange={(v) => setWordsPerParagraph(Array.isArray(v) ? v[0] : v)}
              min={10}
              max={200}
              step={10}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("loremLanguage")}</Label>
            <Select value={language} onValueChange={(v) => setLanguage(v as "zh" | "en")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh">{t("loremChinese")}</SelectItem>
                <SelectItem value="en">{t("loremEnglish")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={generate}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("loremGenerate")}
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={!output}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copy")}
          </Button>
        </div>

        {output && (
          <Textarea
            value={output}
            readOnly
            className="min-h-[40vh] resize-y bg-muted text-sm"
          />
        )}
      </div>
    </ToolLayout>
  );
}
