"use client";

import * as React from "react";
import { Check, ChevronDown, Download } from "lucide-react";

import type { DownloadFormat } from "@/types";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FEEDBACK_RESET_MS } from "@/lib/constants/tool";

/**
 * Generic download button with a transient confirmation flash. When `formats`
 * is provided it becomes a dropdown so a single button can export to several
 * formats (PNG/SVG, JSON/minified, …). Otherwise it's a plain action button.
 *
 * The actual file writing is delegated to `onDownload` so this stays free of
 * any tool-specific encoding logic.
 */
export function DownloadButton({
  onDownload,
  formats,
  label = "Download",
  disabled,
  variant = "default",
  size = "default",
  className,
}: {
  /** Called with the chosen format id (or `undefined` for the single-format case). */
  onDownload: (formatId?: string) => void | Promise<void>;
  formats?: DownloadFormat[];
  label?: string;
  disabled?: boolean;
} & Pick<ButtonProps, "variant" | "size" | "className">) {
  const [done, setDone] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const run = React.useCallback(
    async (formatId?: string) => {
      await onDownload(formatId);
      setDone(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), FEEDBACK_RESET_MS);
    },
    [onDownload]
  );

  if (formats && formats.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant={variant}
            size={size}
            disabled={disabled}
            className={className}
          >
            {done ? <Check className="text-emerald-500" /> : <Download />}
            <span>{label}</span>
            <ChevronDown className="opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {formats.map((format) => (
            <DropdownMenuItem
              key={format.id}
              onSelect={() => void run(format.id)}
            >
              {format.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={disabled}
      className={className}
      onClick={() => void run()}
    >
      {done ? <Check className="text-emerald-500" /> : <Download />}
      <span>{label}</span>
    </Button>
  );
}
