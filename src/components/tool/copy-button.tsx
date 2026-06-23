"use client";

import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Self-contained copy-to-clipboard button. Manages its own transient "Copied!"
 * state and icon swap. Accepts either a string or a lazy getter so callers can
 * defer building large output until the click.
 */
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied!",
  iconOnly = false,
  variant = "outline",
  size = "default",
  className,
  disabled,
  onCopied,
  ...props
}: {
  value: string | (() => string);
  label?: string;
  copiedLabel?: string;
  iconOnly?: boolean;
  onCopied?: (ok: boolean) => void;
} & Omit<ButtonProps, "value" | "onClick">) {
  const { copied, copy } = useCopyToClipboard();

  async function handleClick() {
    const text = typeof value === "function" ? value() : value;
    const ok = await copy(text);
    onCopied?.(ok);
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? "icon" : size}
      onClick={handleClick}
      disabled={disabled}
      aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
      className={cn(className)}
      {...props}
    >
      {copied ? <Check className="text-emerald-500" /> : <Copy />}
      {iconOnly ? null : <span>{copied ? copiedLabel : label}</span>}
    </Button>
  );
}
