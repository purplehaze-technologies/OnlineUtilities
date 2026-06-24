"use client";

import * as React from "react";
import { Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { CopyButton } from "@/components/tool/copy-button";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { cn } from "@/lib/utils";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  rgbToCmyk,
  contrastRatio,
  wcagLevel,
  isValidHex,
  normalizeHex,
  randomHex,
} from "@/lib/utils/color";

const DEFAULT_HEX = "#3b82f6";

function FormatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground w-14 shrink-0 font-medium">
        {label}
      </span>
      <span className="bg-muted/40 min-w-0 flex-1 rounded-md border px-3 py-1.5 font-mono">
        {value}
      </span>
      <CopyButton value={value} iconOnly size="sm" variant="ghost" />
    </div>
  );
}

function ContrastRow({
  against,
  color,
  label,
}: {
  against: string;
  color: string;
  label: string;
}) {
  const ratio = contrastRatio(color, against);
  const level = wcagLevel(ratio);
  const pass = level !== "Fail";
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span
          className="size-5 rounded border shadow-sm"
          style={{ background: against }}
          aria-hidden
        />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono tabular-nums">{ratio.toFixed(2)}:1</span>
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-xs font-semibold",
            pass
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
          )}
        >
          {level}
        </span>
      </div>
    </div>
  );
}

export function ColorPicker() {
  const [hex, setHex] = React.useState(DEFAULT_HEX);
  const [textHex, setTextHex] = React.useState(DEFAULT_HEX);
  const [opacity, setOpacity] = React.useState(100);

  const rgb = hexToRgb(hex) ?? { r: 59, g: 130, b: 246 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const alpha = (opacity / 100).toFixed(2);

  const formats = [
    { label: "HEX", value: hex },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "RGBA", value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "HSV", value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
    {
      label: "CMYK",
      value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    },
  ];

  // Tints: vary lightness while keeping the same hue and saturation
  const tints = [90, 75, 60, 45, 30, 15].map((l) => {
    const { r, g, b } = hslToRgb(hsl.h, hsl.s, l);
    return { hex: rgbToHex(r, g, b), l };
  });

  const whiteContrast = contrastRatio(hex, "#ffffff");
  const textColor = whiteContrast >= 4.5 ? "#ffffff" : "#000000";

  function applyHex(raw: string) {
    const norm = normalizeHex(raw);
    if (isValidHex(norm)) {
      setHex(norm);
      setTextHex(norm);
    }
  }

  function handleNativePicker(e: React.ChangeEvent<HTMLInputElement>) {
    applyHex(e.target.value);
  }

  function handleTextInput(e: React.ChangeEvent<HTMLInputElement>) {
    setTextHex(e.target.value);
    const norm = normalizeHex(e.target.value);
    if (isValidHex(norm)) setHex(norm);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left — color input */}
        <div className="space-y-4">
          <ToolPanel>
            {/* Big swatch / native picker trigger */}
            <label
              className="relative block cursor-pointer overflow-hidden rounded-xl border"
              style={{ height: 160, background: hex }}
              aria-label="Open color picker"
            >
              <input
                type="color"
                value={hex}
                onChange={handleNativePicker}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <span
                className="absolute right-3 bottom-3 rounded-lg px-3 py-1.5 font-mono text-sm font-semibold shadow"
                style={{
                  background:
                    textColor === "#ffffff"
                      ? "rgba(0,0,0,.35)"
                      : "rgba(255,255,255,.35)",
                  color: textColor,
                }}
              >
                {hex}
              </span>
            </label>

            <ToolField label="HEX" htmlFor="cp-hex">
              <div className="flex gap-2">
                <Input
                  id="cp-hex"
                  value={textHex}
                  onChange={handleTextInput}
                  onBlur={() => setTextHex(hex)}
                  className="font-mono uppercase"
                  spellCheck={false}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => applyHex(randomHex())}
                  aria-label="Random color"
                >
                  <Shuffle />
                </Button>
              </div>
            </ToolField>

            <ToolField
              label="Opacity"
              htmlFor="cp-opacity"
              labelAddon={`${opacity}%`}
            >
              <Slider
                id="cp-opacity"
                min={0}
                max={100}
                step={1}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
              />
            </ToolField>
          </ToolPanel>
        </div>

        {/* Right — outputs */}
        <div className="space-y-4">
          <ToolPanel title="Color Formats">
            <div className="space-y-2">
              {formats.map((f) => (
                <FormatRow key={f.label} {...f} />
              ))}
            </div>
          </ToolPanel>

          <ToolPanel title="Contrast Checker">
            <div className="space-y-3">
              <ContrastRow against="#ffffff" color={hex} label="vs White" />
              <ContrastRow against="#000000" color={hex} label="vs Black" />
            </div>
            <div className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm">
              <span className="text-muted-foreground">Recommended text</span>
              <span
                className="rounded-md px-3 py-1 font-semibold"
                style={{ background: hex, color: textColor }}
              >
                {textColor === "#ffffff" ? "White text" : "Black text"}
              </span>
            </div>
          </ToolPanel>

          <ToolPanel title="Tints">
            <div className="flex gap-2">
              {tints.map(({ hex: th, l }) => (
                <button
                  key={l}
                  type="button"
                  className="focus-visible:ring-ring h-10 flex-1 rounded-lg border transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:outline-none"
                  style={{ background: th }}
                  onClick={() => applyHex(th)}
                  aria-label={`Tint ${th}`}
                  title={th}
                />
              ))}
            </div>
          </ToolPanel>
        </div>
      </div>

      <ToolPrivacyNotice />
    </div>
  );
}
