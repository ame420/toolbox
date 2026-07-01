"use client";

import { useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

function secureRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  if (range <= 0) return min;
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return min + (bytes[0] % range);
}

export default function RandomPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("number");

  // Number
  const [numMin, setNumMin] = useState(1);
  const [numMax, setNumMax] = useState(100);
  const [numCount, setNumCount] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);

  // Dice
  const [diceSides, setDiceSides] = useState(6);
  const [diceCount, setDiceCount] = useState(2);
  const [diceResults, setDiceResults] = useState<number[]>([]);

  // Coin
  const [coinCount, setCoinCount] = useState(1);
  const [coinResults, setCoinResults] = useState<boolean[]>([]);

  // List
  const [listItems, setListItems] = useState("");
  const [pickCount, setPickCount] = useState(1);
  const [pickedItems, setPickedItems] = useState<string[]>([]);

  const generateNumbers = () => {
    const min = Math.min(numMin, numMax);
    const max = Math.max(numMin, numMax);
    const result: number[] = [];
    for (let i = 0; i < numCount; i += 1) {
      result.push(secureRandomInt(min, max));
    }
    setNumbers(result);
  };

  const rollDice = () => {
    const result: number[] = [];
    for (let i = 0; i < diceCount; i += 1) {
      result.push(secureRandomInt(1, diceSides));
    }
    setDiceResults(result);
  };

  const flipCoins = () => {
    const result: boolean[] = [];
    for (let i = 0; i < coinCount; i += 1) {
      const bytes = new Uint32Array(1);
      if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
        crypto.getRandomValues(bytes);
      } else {
        bytes[0] = Math.floor(Math.random() * 0xffffffff);
      }
      result.push(bytes[0] % 2 === 0);
    }
    setCoinResults(result);
  };

  const pickFromList = () => {
    const items = listItems
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0) {
      toast.warning(t("pleaseInput"));
      return;
    }
    const count = Math.min(Math.max(1, pickCount), items.length);
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = secureRandomInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPickedItems(shuffled.slice(0, count));
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader title={t("randomTitle")} description={t("randomDesc")} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col gap-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="number">{t("randomNumber")}</TabsTrigger>
          <TabsTrigger value="dice">{t("randomDice")}</TabsTrigger>
          <TabsTrigger value="coin">{t("randomCoin")}</TabsTrigger>
          <TabsTrigger value="list">{t("randomList")}</TabsTrigger>
        </TabsList>

        <TabsContent value="number" className="flex flex-1 flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="num-min">{t("randomMin")}</Label>
              <Input
                id="num-min"
                type="number"
                value={numMin}
                onChange={(e) => setNumMin(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="num-max">{t("randomMax")}</Label>
              <Input
                id="num-max"
                type="number"
                value={numMax}
                onChange={(e) => setNumMax(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("randomCount")}: {numCount}</Label>
              <Slider value={[numCount]} onValueChange={(v) => setNumCount(Array.isArray(v) ? v[0] : v)} min={1} max={100} step={1} />
            </div>
          </div>
          <Button onClick={generateNumbers}>{t("randomGenerate")}</Button>
          {numbers.length > 0 && (
            <ResultBox
              value={numbers.join(", ")}
              onCopy={() => handleCopy(numbers.join("\n"))}
              onClear={() => setNumbers([])}
            />
          )}
        </TabsContent>

        <TabsContent value="dice" className="flex flex-1 flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dice-sides">{t("randomSides")}</Label>
              <Input
                id="dice-sides"
                type="number"
                min={2}
                value={diceSides}
                onChange={(e) => setDiceSides(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("randomCount")}: {diceCount}</Label>
              <Slider value={[diceCount]} onValueChange={(v) => setDiceCount(Array.isArray(v) ? v[0] : v)} min={1} max={20} step={1} />
            </div>
          </div>
          <Button onClick={rollDice}>{t("randomRoll")}</Button>
          {diceResults.length > 0 && (
            <ResultBox
              value={diceResults.join(", ")}
              onCopy={() => handleCopy(diceResults.join("\n"))}
              onClear={() => setDiceResults([])}
            />
          )}
        </TabsContent>

        <TabsContent value="coin" className="flex flex-1 flex-col gap-4">
          <div className="space-y-2">
            <Label>{t("randomCount")}: {coinCount}</Label>
            <Slider value={[coinCount]} onValueChange={(v) => setCoinCount(Array.isArray(v) ? v[0] : v)} min={1} max={100} step={1} />
          </div>
          <Button onClick={flipCoins}>{t("randomFlip")}</Button>
          {coinResults.length > 0 && (
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <p className="text-sm">
                {t("randomHeads")}: {coinResults.filter(Boolean).length} · {t("randomTails")}: {coinResults.filter((v) => !v).length}
              </p>
              <ResultBox
                value={coinResults.map((v) => (v ? t("randomHeads") : t("randomTails"))).join(", ")}
                onCopy={() =>
                  handleCopy(
                    coinResults.map((v) => (v ? t("randomHeads") : t("randomTails"))).join("\n")
                  )
                }
                onClear={() => setCoinResults([])}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="list-items">{t("randomItems")}</Label>
            <Textarea
              id="list-items"
              value={listItems}
              onChange={(e) => setListItems(e.target.value)}
              placeholder={t("pleaseInput")}
              className="min-h-[160px] resize-y"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("randomPickCount")}: {pickCount}</Label>
            <Slider value={[pickCount]} onValueChange={(v) => setPickCount(Array.isArray(v) ? v[0] : v)} min={1} max={50} step={1} />
          </div>
          <Button onClick={pickFromList}>{t("randomPick")}</Button>
          {pickedItems.length > 0 && (
            <ResultBox
              value={pickedItems.join("\n")}
              onCopy={() => handleCopy(pickedItems.join("\n"))}
              onClear={() => setPickedItems([])}
            />
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}

function ResultBox({
  value,
  onCopy,
  onClear,
}: {
  value: string;
  onCopy: () => void;
  onClear: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <Label className="mb-2 block text-sm font-medium">{t("randomResult")}</Label>
      <div className="mb-3 max-h-[200px] overflow-auto break-all rounded-md bg-muted p-3 font-mono text-sm whitespace-pre-wrap">
        {value}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCopy}>
          <Copy className="mr-2 h-4 w-4" />
          {t("copy")}
        </Button>
        <Button variant="outline" onClick={onClear}>
          <Trash2 className="mr-2 h-4 w-4" />
          {t("clear")}
        </Button>
      </div>
    </div>
  );
}
