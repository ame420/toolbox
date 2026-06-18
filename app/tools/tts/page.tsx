"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export default function TtsPage() {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !voiceUri) {
        const zhVoice =
          available.find((v) => v.lang.startsWith("zh")) || available[0];
        setVoiceUri(zhVoice.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [voiceUri]);

  const createUtterance = () => {
    const u = new SpeechSynthesisUtterance(text);
    const selected = voices.find((v) => v.voiceURI === voiceUri);
    if (selected) u.voice = selected;
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => setSpeaking(false);
    u.onerror = () => {
      setSpeaking(false);
      toast.error(t("ttsError"));
    };
    utteranceRef.current = u;
    return u;
  };

  const speak = () => {
    if (!text.trim()) {
      toast.warning(t("ttsPleaseInput"));
      return;
    }
    window.speechSynthesis.cancel();
    const u = createUtterance();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
    setPaused(false);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setPaused(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  const clear = () => {
    stop();
    setText("");
  };

  return (
    <ToolLayout maxWidth="max-w-4xl">
      <PageHeader
        title={t("ttsTitle")}
        description={t("ttsDesc")}
      />

      <div className="flex flex-1 flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="voice">{t("ttsVoice")}</Label>
            <select
              id="voice"
              value={voiceUri}
              onChange={(e) => setVoiceUri(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {voices.map((v, i) => (
                <option key={`${v.voiceURI}-${i}`} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border bg-card p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>{t("ttsRate")}: {rate.toFixed(1)}</Label>
            </div>
            <Slider
              value={[rate]}
              onValueChange={(v) => setRate((v as number[])[0])}
              min={0.5}
              max={2}
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>{t("ttsPitch")}: {pitch.toFixed(1)}</Label>
            </div>
            <Slider
              value={[pitch]}
              onValueChange={(v) => setPitch((v as number[])[0])}
              min={0.5}
              max={2}
              step={0.1}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("ttsPleaseInput")}
            className="min-h-[40vh] flex-1 resize-y md:min-h-[360px]"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {!speaking ? (
            <Button onClick={speak}>
              <Play className="mr-2 h-4 w-4" />
              {t("ttsSpeak")}
            </Button>
          ) : paused ? (
            <Button onClick={resume}>
              <Play className="mr-2 h-4 w-4" />
              {t("ttsResume")}
            </Button>
          ) : (
            <Button variant="secondary" onClick={pause}>
              <Pause className="mr-2 h-4 w-4" />
              {t("ttsPause")}
            </Button>
          )}
          <Button variant="outline" onClick={stop} disabled={!speaking}>
            <Square className="mr-2 h-4 w-4" />
            {t("ttsStop")}
          </Button>
          <Button variant="outline" onClick={clear}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("clear")}
          </Button>
        </div>

        {voices.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t("ttsNoVoices")}
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
