"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function TimerPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"countdown" | "stopwatch">("countdown");

  // Countdown
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [countdownLeft, setCountdownLeft] = useState(5 * 60);
  const [countdownRunning, setCountdownRunning] = useState(false);
  const countdownEndRef = useRef<number | null>(null);

  // Stopwatch
  const [elapsedMs, setElapsedMs] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const stopwatchStartRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdownRunning && countdownEndRef.current) {
        const remaining = Math.max(0, Math.ceil((countdownEndRef.current - Date.now()) / 1000));
        setCountdownLeft(remaining);
        if (remaining === 0) {
          countdownEndRef.current = null;
          setCountdownRunning(false);
          toast.success(t("timerTimeUp"));
        }
      }

      if (stopwatchRunning && stopwatchStartRef.current) {
        setElapsedMs(Date.now() - stopwatchStartRef.current);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [countdownRunning, stopwatchRunning, t]);

  const applyCountdownInput = () => {
    const total = Math.max(0, hours * 3600 + minutes * 60 + seconds);
    setCountdownLeft(total);
  };

  const toggleCountdown = () => {
    if (countdownRunning) {
      countdownEndRef.current = null;
      setCountdownRunning(false);
    } else {
      if (countdownLeft === 0) applyCountdownInput();
      if (countdownLeft === 0) return;
      countdownEndRef.current = Date.now() + countdownLeft * 1000;
      setCountdownRunning(true);
    }
  };

  const resetCountdown = () => {
    countdownEndRef.current = null;
    setCountdownRunning(false);
    applyCountdownInput();
  };

  const toggleStopwatch = () => {
    if (stopwatchRunning) {
      setStopwatchRunning(false);
      stopwatchStartRef.current = null;
    } else {
      stopwatchStartRef.current = Date.now() - elapsedMs;
      setStopwatchRunning(true);
    }
  };

  const resetStopwatch = () => {
    setStopwatchRunning(false);
    stopwatchStartRef.current = null;
    setElapsedMs(0);
    setLaps([]);
  };

  const addLap = () => {
    setLaps((prev) => [...prev, elapsedMs]);
  };

  const formatCountdown = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(cs)}`;
  };

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader title={t("timerTitle")} description={t("timerDesc")} />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "countdown" | "stopwatch")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="countdown">{t("timerCountdown")}</TabsTrigger>
          <TabsTrigger value="stopwatch">{t("timerStopwatch")}</TabsTrigger>
        </TabsList>

        <TabsContent value="countdown" className="flex flex-col gap-6">
          <div className="text-center">
            <p className="text-6xl font-bold tabular-nums">{formatCountdown(countdownLeft)}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: t("timerHours"), value: hours, setter: setHours },
              { label: t("timerMinutes"), value: minutes, setter: setMinutes },
              { label: t("timerSeconds"), value: seconds, setter: setSeconds },
            ].map(({ label, value, setter }) => (
              <div key={label} className="space-y-2">
                <Label>{label}</Label>
                <Input
                  type="number"
                  min={0}
                  max={label === t("timerHours") ? 23 : 59}
                  value={value}
                  disabled={countdownRunning}
                  onChange={(e) => {
                    setter(Math.max(0, Math.min(Number(e.target.value), label === t("timerHours") ? 23 : 59)));
                  }}
                  onBlur={applyCountdownInput}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={toggleCountdown}>
              {countdownRunning ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  {t("pomodoroPause")}
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  {t("pomodoroStart")}
                </>
              )}
            </Button>
            <Button variant="outline" size="lg" onClick={resetCountdown}>
              <RotateCcw className="mr-2 h-5 w-5" />
              {t("pomodoroReset")}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="stopwatch" className="flex flex-col gap-6">
          <div className="text-center">
            <p className="text-6xl font-bold tabular-nums">{formatStopwatch(elapsedMs)}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={toggleStopwatch}>
              {stopwatchRunning ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  {t("pomodoroPause")}
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  {t("pomodoroStart")}
                </>
              )}
            </Button>
            <Button variant="outline" size="lg" onClick={addLap} disabled={!stopwatchRunning}>
              <Flag className="mr-2 h-5 w-5" />
              {t("timerLap")}
            </Button>
            <Button variant="outline" size="lg" onClick={resetStopwatch}>
              <RotateCcw className="mr-2 h-5 w-5" />
              {t("pomodoroReset")}
            </Button>
          </div>

          {laps.length > 0 && (
            <div className="rounded-lg border bg-card">
              <div className="border-b px-4 py-2 text-sm font-medium">{t("timerLaps")}</div>
              <div className="max-h-[30vh] overflow-auto">
                {laps.map((lap, index) => (
                  <div
                    key={index}
                    className="flex justify-between px-4 py-2 text-sm tabular-nums even:bg-muted"
                  >
                    <span>#{index + 1}</span>
                    <span>{formatStopwatch(lap)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
