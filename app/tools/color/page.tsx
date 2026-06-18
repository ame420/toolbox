"use client";

import { useMemo, useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

interface Oklch {
  l: number;
  c: number;
  h: number;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseHex(hex: string): Rgb | null {
  const trimmed = hex.trim();
  const m = trimmed.match(/^#?([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
  if (!m) return null;
  let v = m[1];
  if (v.length === 3 || v.length === 4) {
    v = v
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === R) h = ((G - B) / d + (G < B ? 6 : 0)) / 6;
    else if (max === G) h = ((B - R) / d + 2) / 6;
    else h = ((R - G) / d + 4) / 6;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h: h * 360, s, l };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const H = ((h % 360) + 360) % 360;
  const S = clamp(s, 0, 1);
  const L = clamp(l, 0, 1);
  const c = (1 - Math.abs(2 * L - 1)) * S;
  const x = c * (1 - Math.abs(((H / 60) % 2) - 1));
  const m = L - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (H < 60) {
    r = c;
    g = x;
  } else if (H < 120) {
    r = x;
    g = c;
  } else if (H < 180) {
    g = c;
    b = x;
  } else if (H < 240) {
    g = x;
    b = c;
  } else if (H < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function linearize(v: number) {
  v /= 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function delinearize(v: number) {
  const c = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(clamp(c * 255, 0, 255));
}

function rgbToXyz({ r, g, b }: Rgb) {
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);
  return {
    x: lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375,
    y: lr * 0.2126729 + lg * 0.7151522 + lb * 0.072175,
    z: lr * 0.0193339 + lg * 0.119192 + lb * 0.9503041,
  };
}

function xyzToRgb({ x, y, z }: { x: number; y: number; z: number }): Rgb {
  const r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  const g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  const b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;
  return {
    r: delinearize(r),
    g: delinearize(g),
    b: delinearize(b),
  };
}

const WHITE_D65 = { x: 0.95047, y: 1, z: 1.08883 };

function fLab(t: number) {
  return t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116;
}

function invFLab(t: number) {
  return Math.pow(t, 3) > 0.008856 ? Math.pow(t, 3) : (t - 16 / 116) / 7.787;
}

function xyzToLab({ x, y, z }: { x: number; y: number; z: number }) {
  const l = 116 * fLab(y / WHITE_D65.y) - 16;
  const a = 500 * (fLab(x / WHITE_D65.x) - fLab(y / WHITE_D65.y));
  const b = 200 * (fLab(y / WHITE_D65.y) - fLab(z / WHITE_D65.z));
  return { l, a, b };
}

function labToXyz({ l, a, b }: { l: number; a: number; b: number }) {
  const fy = (l + 16) / 116;
  return {
    x: WHITE_D65.x * invFLab(fy + a / 500),
    y: WHITE_D65.y * invFLab(fy),
    z: WHITE_D65.z * invFLab(fy - b / 200),
  };
}

function labToOklch({ l, a, b }: { l: number; a: number; b: number }): Oklch {
  return {
    l,
    c: Math.sqrt(a * a + b * b),
    h: (Math.atan2(b, a) * 180) / Math.PI,
  };
}

function oklchToLab({ l, c, h }: Oklch): { l: number; a: number; b: number } {
  const hr = (h * Math.PI) / 180;
  return {
    l,
    a: c * Math.cos(hr),
    b: c * Math.sin(hr),
  };
}

function rgbToOklch(rgb: Rgb): Oklch {
  return labToOklch(xyzToLab(rgbToXyz(rgb)));
}

function oklchToRgb(ok: Oklch): Rgb {
  return xyzToRgb(labToXyz(oklchToLab(ok)));
}

function formatHsl({ h, s, l }: Hsl): string {
  return `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

function formatOklch({ l, c, h }: Oklch): string {
  const hue = Number.isFinite(h) ? `${Math.round(h)}` : "0";
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${hue})`;
}

function formatRgb({ r, g, b }: Rgb): string {
  return `rgb(${Math.round(clamp(r, 0, 255))}, ${Math.round(clamp(g, 0, 255))}, ${Math.round(clamp(b, 0, 255))})`;
}

function relativeLuminance({ r, g, b }: Rgb): number {
  const [R, G, B] = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export default function ColorPage() {
  const { t } = useI18n();
  const [rgb, setRgb] = useState<Rgb>({ r: 59, g: 130, b: 246 });

  const hex = useMemo(() => rgbToHex(rgb), [rgb]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const oklch = useMemo(() => rgbToOklch(rgb), [rgb]);

  const updateFromHex = (value: string) => {
    const parsed = parseHex(value);
    if (parsed) setRgb(parsed);
  };

  const updateFromRgb = (value: string) => {
    const m = value.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (m) {
      setRgb({ r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) });
    }
  };

  const updateFromHsl = (value: string) => {
    const m = value.match(
      /hsla?\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%/i
    );
    if (m) {
      setRgb(hslToRgb({ h: Number(m[1]), s: Number(m[2]) / 100, l: Number(m[3]) / 100 }));
    }
  };

  const updateFromOklch = (value: string) => {
    const m = value.match(/oklch\s*\(\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*\)/i);
    if (m) {
      setRgb(oklchToRgb({ l: Number(m[1]), c: Number(m[2]), h: Number(m[3]) }));
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t("copied"));
  };

  const contrastWhite = useMemo(() => contrastRatio(rgb, { r: 255, g: 255, b: 255 }), [rgb]);
  const contrastBlack = useMemo(() => contrastRatio(rgb, { r: 0, g: 0, b: 0 }), [rgb]);

  const inputs = [
    { key: "hex", label: t("colorHex"), value: hex, onChange: updateFromHex },
    { key: "rgb", label: t("colorRgb"), value: formatRgb(rgb), onChange: updateFromRgb },
    { key: "hsl", label: t("colorHsl"), value: formatHsl(hsl), onChange: updateFromHsl },
    { key: "oklch", label: t("colorOklch"), value: formatOklch(oklch), onChange: updateFromOklch },
  ] as const;

  return (
    <ToolLayout maxWidth="max-w-5xl">
      <PageHeader title={t("colorTitle")} description={t("colorDesc")} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {inputs.map(({ key, label, value, onChange }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`color-${key}`}>{label}</Label>
              <div className="flex gap-2">
                <Input
                  id={`color-${key}`}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="font-mono"
                />
                <Button variant="outline" size="icon" onClick={() => copy(value)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm font-medium">{t("colorContrastWhite")}</p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  contrastWhite >= 4.5 ? "text-green-600" : "text-destructive"
                }`}
              >
                {round2(contrastWhite)} {contrastWhite >= 4.5 ? t("colorPass") : t("colorFail")}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm font-medium">{t("colorContrastBlack")}</p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  contrastBlack >= 4.5 ? "text-green-600" : "text-destructive"
                }`}
              >
                {round2(contrastBlack)} {contrastBlack >= 4.5 ? t("colorPass") : t("colorFail")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="flex flex-1 items-center justify-center rounded-2xl border shadow-sm"
            style={{ backgroundColor: hex }}
          >
            <div className="text-center">
              <p className="px-4 text-3xl font-bold" style={{ color: "#ffffff" }}>
                {hex}
              </p>
              <p className="mt-2 px-4 text-lg" style={{ color: "#000000" }}>
                {hex}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRgb({ r: 59, g: 130, b: 246 })}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("reset")}
            </Button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
