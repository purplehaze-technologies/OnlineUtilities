"use client";

import * as React from "react";
import { ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { ToolField } from "@/components/tool/tool-field";
import { ToolStats } from "@/components/tool/tool-stats";
import { CopyButton } from "@/components/tool/copy-button";
import { DownloadButton } from "@/components/tool/download-button";
import { FileDropZone } from "@/components/tool/file-drop-zone";
import { CodeDisplay } from "@/components/tool/code-display";
import { ValidationMessage } from "@/components/shared/validation-message";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { useFileReader } from "@/hooks/use-file-reader";
import { downloadText, generateFileName, formatBytes } from "@/lib/utils";

const ACCEPTED = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export function ImageToBase64() {
  const { state, read, reset } = useFileReader();
  const [dataUrlMode, setDataUrlMode] = React.useState(true);

  // Display either the full data URL or just the raw base64 string.
  const output = React.useMemo(() => {
    if (state.status !== "done") return "";
    if (dataUrlMode) return state.result;
    // Strip "data:<mime>;base64," prefix.
    const commaIdx = state.result.indexOf(",");
    return commaIdx >= 0 ? state.result.slice(commaIdx + 1) : state.result;
  }, [state, dataUrlMode]);

  function handleFile(file: File) {
    read(file, "dataURL");
  }

  const hasResult = state.status === "done" && output.length > 0;
  const originalBytes = state.status === "done" ? state.file.size : 0;
  const encodedBytes = output.length;

  const stats = hasResult
    ? [
        { label: "Original", value: formatBytes(originalBytes) },
        { label: "Encoded", value: formatBytes(encodedBytes) },
        {
          label: "Ratio",
          value: `${((encodedBytes / originalBytes) * 100).toFixed(0)}%`,
        },
        {
          label: "Type",
          value: state.status === "done" ? state.file.type || "unknown" : "—",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Upload */}
      {state.status !== "done" ? (
        <ToolPanel>
          <FileDropZone
            onFile={handleFile}
            accept={ACCEPTED}
            maxBytes={MAX_BYTES}
            label="Drop an image here, or click to browse"
            sublabel="PNG, JPEG, WEBP, GIF, SVG · max 10 MB · or paste an image"
          />
          {state.status === "error" ? (
            <ValidationMessage status="error">
              {state.message}
            </ValidationMessage>
          ) : null}
        </ToolPanel>
      ) : null}

      {/* Preview + output */}
      {state.status === "done" ? (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Preview */}
            <ToolPanel
              title="Image preview"
              action={
                <Button type="button" variant="ghost" size="sm" onClick={reset}>
                  <X />
                  Remove
                </Button>
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={state.result}
                alt={state.file.name}
                className="max-h-72 w-full rounded-lg object-contain"
              />
              <p className="text-muted-foreground text-xs">{state.file.name}</p>
            </ToolPanel>

            {/* Controls */}
            <ToolPanel title="Options">
              <ToolField
                label="Include data URL prefix"
                htmlFor="img-dataurl-mode"
                description={
                  dataUrlMode
                    ? "Output: data:image/png;base64,…  (usable in <img src> or CSS)"
                    : "Output: raw Base64 string only"
                }
                orientation="horizontal"
              >
                <Switch
                  id="img-dataurl-mode"
                  checked={dataUrlMode}
                  onCheckedChange={setDataUrlMode}
                />
              </ToolField>
              <ToolStats stats={stats} columns={2} />
            </ToolPanel>
          </div>

          {/* Output */}
          <ToolPanel
            title={dataUrlMode ? "Data URL" : "Base64 string"}
            description="The full encoded value — copy or download for use in your project."
          >
            <CodeDisplay code={output} language="text" maxHeight={200} />
            <ToolActionBar>
              <CopyButton value={output} label="Copy" disabled={!hasResult} />
              <DownloadButton
                onDownload={() =>
                  downloadText(
                    output,
                    generateFileName(
                      state.file.name.replace(/\.[^.]+$/, ""),
                      "txt"
                    )
                  )
                }
                label="Download .txt"
                variant="outline"
                disabled={!hasResult}
              />
            </ToolActionBar>
          </ToolPanel>
        </>
      ) : null}

      {state.status === "idle" ? (
        <div className="bg-muted/20 flex items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center">
          <ImageIcon className="text-muted-foreground size-5 shrink-0" />
          <p className="text-muted-foreground text-sm">
            Upload an image above to see its Base64 representation.
          </p>
        </div>
      ) : null}

      <ToolPrivacyNotice />
    </div>
  );
}
