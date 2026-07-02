"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { EMOJI_CATEGORIES } from "@/lib/emoji-data";

export default function EmojiPage() {
  const { lang, t } = useI18n();
  const [search, setSearch] = useState("");

  const categoryNames: Record<string, string> = {
    smileys: t("emojiSmileys"),
    people: t("emojiPeople"),
    animals: t("emojiAnimals"),
    food: t("emojiFood"),
    travel: t("emojiTravel"),
    activities: t("emojiActivities"),
    objects: t("emojiObjects"),
    symbols: t("emojiSymbols"),
  };

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return EMOJI_CATEGORIES;
    return EMOJI_CATEGORIES.map((cat) => ({
      ...cat,
      emojis: cat.emojis.filter((emoji) => {
        const name = lang === "zh" ? cat.nameZh : cat.nameEn;
        return name.toLowerCase().includes(q) || emoji === q;
      }),
    })).filter((cat) => cat.emojis.length > 0);
  }, [search, lang]);

  const handleCopy = async (emoji: string) => {
    await navigator.clipboard.writeText(emoji);
    toast.success(t("copied"));
  };

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("emojiTitle")} description={t("emojiDesc")} />

      <div className="flex flex-1 flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("emojiSearch")}
            className="pl-9"
          />
        </div>

        <Tabs defaultValue={filteredCategories[0]?.id ?? "smileys"}>
          <TabsList className="flex h-auto flex-wrap justify-start gap-1">
            {filteredCategories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                {categoryNames[cat.id]}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredCategories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id}>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                {cat.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleCopy(emoji)}
                    className="flex aspect-square items-center justify-center rounded-md border bg-card text-2xl transition-colors hover:bg-muted"
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ToolLayout>
  );
}
