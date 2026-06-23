"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isValidHex, normalizeHex } from "@/lib/utils/color";

/**
 * Color control combining a native swatch picker with a synced hex text input,
 * so users can pick visually or paste an exact value. Emits normalized hex via
 * `onChange`. Wrap it in `ToolField` for a label. Reused by the QR/barcode
 * generators, color picker and any theming control.
 */
export function ColorField({
  id,
  value,
  onChange,
  disabled,
  className,
}: {
  id?: string;
  value: string;
  onChange: (hex: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  // Keep raw text local so the user can type partial values without fighting
  // it. Sync to the controlled `value` during render (no effect needed) using
  // React's "adjust state when a prop changes" pattern.
  const [text, setText] = React.useState(value);
  const [lastValue, setLastValue] = React.useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setText(value);
  }

  function commitText(next: string) {
    setText(next);
    if (isValidHex(next)) onChange(normalizeHex(next));
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        type="color"
        aria-label="Color picker"
        value={isValidHex(value) ? normalizeHex(value) : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="border-input size-10 shrink-0 cursor-pointer rounded-md border bg-transparent p-1 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Input
        id={id}
        value={text}
        onChange={(e) => commitText(e.target.value)}
        onBlur={() => setText(value)}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        aria-invalid={!isValidHex(text)}
        className="font-mono uppercase"
      />
    </div>
  );
}
