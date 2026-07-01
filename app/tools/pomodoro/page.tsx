"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface Session {
  mode: "work" | "break";
  duration: number;
  secondsLeft: number;
  isRunning: boolean;
}

export default function PomodoroPage() {
  const { t } = useI18n();
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [session, setSession] = useState<Session>({
    mode: "work",
    duration: workMinutes * 60,
    secondsLeft: workMinutes * 60,
    isRunning: false,
  });
  const endAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!session.isRunning) return;
    const timer = setInterval(() => {
      if (endAtRef.current) {
        const remaining = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
        setSession((prev) => ({ ...prev, secondsLeft: remaining }));
        if (remaining === 0) {
          endAtRef.current = null;
          setSession((prev) => {
            const nextMode = prev.mode === "work" ? "break" : "work";
            const nextDuration = nextMode === "work" ? workMinutes * 60 : breakMinutes * 60;
            toast.success(
              prev.mode === "work" ? t("pomodoroWorkComplete") : t("pomodoroBreakComplete")
            );
            return {
              ...prev,
              mode: nextMode,
              duration: nextDuration,
              secondsLeft: nextDuration,
              isRunning: false,
            };
          });
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [session.isRunning, workMinutes, breakMinutes, t]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const toggle = () => {
    setSession((prev) => {
      if (prev.isRunning) {
        endAtRef.current = null;
        return { ...prev, isRunning: false };
      }
      endAtRef.current = Date.now() + prev.secondsLeft * 1000;
      return { ...prev, isRunning: true };
    });
  };

  const reset = () => {
    endAtRef.current = null;
    setSession((prev) => ({
      ...prev,
      isRunning: false,
      secondsLeft: prev.duration,
    }));
  };

  const switchMode = (newMode: "work" | "break") => {
    const newDuration = newMode === "work" ? workMinutes * 60 : breakMinutes * 60;
    endAtRef.current = null;
    setSession({
      mode: newMode,
      duration: newDuration,
      secondsLeft: newDuration,
      isRunning: false,
    });
  };

  const handleWorkMinutesChange = (val: number) => {
    setWorkMinutes(val);
    setSession((prev) => {
      if (prev.isRunning || prev.mode !== "work") return prev;
      const newDuration = val * 60;
      return { ...prev, duration: newDuration, secondsLeft: newDuration };
    });
  };

  const handleBreakMinutesChange = (val: number) => {
    setBreakMinutes(val);
    setSession((prev) => {
      if (prev.isRunning || prev.mode !== "break") return prev;
      const newDuration = val * 60;
      return { ...prev, duration: newDuration, secondsLeft: newDuration };
    });
  };

  const progress =
    session.duration > 0
      ? ((session.duration - session.secondsLeft) / session.duration) * 100
      : 0;

  return (
    <ToolLayout maxWidth="max-w-3xl">
      <PageHeader title={t("pomodoroTitle")} description={t("pomodoroDesc")} />

      <div className="flex flex-1 flex-col items-center gap-6">
        <div className="flex gap-2">
          <Button
            variant={session.mode === "work" ? "default" : "outline"}
            onClick={() => switchMode("work")}
          >
            {t("pomodoroWork")}
          </Button>
          <Button
            variant={session.mode === "break" ? "default" : "outline"}
            onClick={() => switchMode("break")}
          >
            {t("pomodoroBreak")}
          </Button>
        </div>

        <div className="relative flex h-64 w-64 items-center justify-center rounded-full border-8 border-muted">
          <div
            className="absolute inset-0 rounded-full bg-primary/10 transition-all"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
            }}
          />
          <div className="z-10 text-center">
            <p className="text-5xl font-bold tabular-nums">{formatTime(session.secondsLeft)}</p>
            <Badge variant={session.mode === "work" ? "default" : "secondary"} className="mt-2">
              {session.mode === "work" ? t("pomodoroWork") : t("pomodoroBreak")}
            </Badge>
          </div>
        </div>

        <div className="flex gap-3">
          <Button size="lg" onClick={toggle}>
            {session.isRunning ? (
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
          <Button variant="outline" size="lg" onClick={reset}>
            <RotateCcw className="mr-2 h-5 w-5" />
            {t("pomodoroReset")}
          </Button>
        </div>

        <div className="grid w-full gap-4 rounded-lg border bg-card p-4 shadow-sm sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="work-minutes">{t("pomodoroCustomWork")} ({t("pomodoroMinutes")})</Label>
            <Input
              id="work-minutes"
              type="number"
              min={1}
              max={120}
              value={workMinutes}
              onChange={(e) => handleWorkMinutesChange(Number(e.target.value))}
              disabled={session.isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="break-minutes">{t("pomodoroCustomBreak")} ({t("pomodoroMinutes")})</Label>
            <Input
              id="break-minutes"
              type="number"
              min={1}
              max={60}
              value={breakMinutes}
              onChange={(e) => handleBreakMinutesChange(Number(e.target.value))}
              disabled={session.isRunning}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
