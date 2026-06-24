"use client";

import * as React from "react";
import { Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/utils";

/**
 * Generic drag-and-drop / click-to-browse / paste file zone. Used by
 * Image→Base64 and JSON Formatter (file upload). Keeps all file-picking
 * logic in one place so future tools (CSV parser, PDF viewer, etc.) can
 * reuse it without re-inventing drag state.
 */
export function FileDropZone({
  onFile,
  accept,
  maxBytes,
  label = "Drop a file here, or click to browse",
  sublabel,
  disabled,
  className,
}: {
  onFile: (file: File) => void;
  accept?: string;
  maxBytes?: number;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  className?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [sizeError, setSizeError] = React.useState<string | null>(null);

  function handleFile(file: File) {
    if (maxBytes && file.size > maxBytes) {
      setSizeError(
        `File too large (${formatBytes(file.size)} — max ${formatBytes(maxBytes)})`
      );
      return;
    }
    setSizeError(null);
    onFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be re-selected.
    e.target.value = "";
  }

  // Paste support: intercept image/text paste events anywhere on the zone.
  function onPaste(e: React.ClipboardEvent) {
    const file = e.clipboardData.files[0];
    if (file) {
      e.preventDefault();
      handleFile(file);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onPaste={onPaste}
        aria-label={label}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
          <Upload className="size-6" aria-hidden />
        </span>
        <span className="space-y-1">
          <span className="block text-sm font-medium">{label}</span>
          {sublabel ? (
            <span className="text-muted-foreground block text-xs">
              {sublabel}
            </span>
          ) : null}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onInputChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />
      {sizeError ? (
        <p className="text-destructive text-xs">{sizeError}</p>
      ) : null}
    </div>
  );
}
