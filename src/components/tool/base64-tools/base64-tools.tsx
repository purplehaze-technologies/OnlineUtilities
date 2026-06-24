"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { CopyButton } from "@/components/tool/copy-button";
import { DownloadButton } from "@/components/tool/download-button";
import { ToolStats } from "@/components/tool/tool-stats";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { ValidationMessage } from "@/components/shared/validation-message";
import { useDebounce } from "@/hooks/use-debounce";
import {
  encodeBase64,
  decodeBase64,
  toUrlSafeBase64,
  fromUrlSafeBase64,
} from "@/lib/utils/encoding";
import { downloadText, generateFileName, byteLength } from "@/lib/utils";

type Mode = "encode" | "decode";

function convert(
  raw: string,
  mode: Mode,
  urlSafe: boolean
): { output: string; error: string | null } {
  if (!raw.trim()) return { output: "", error: null };
  try {
    if (mode === "encode") {
      let result = encodeBase64(raw);
      if (urlSafe) result = toUrlSafeBase64(result);
      return { output: result, error: null };
    }
    const b64 = urlSafe ? fromUrlSafeBase64(raw) : raw;
    return { output: decodeBase64(b64.replace(/\s/g, "")), error: null };
  } catch (e) {
    return {
      output: "",
      error: e instanceof Error ? e.message : "Invalid input",
    };
  }
}

export function Base64Tools() {
  const [mode, setMode] = React.useState<Mode>("encode");
  const [urlSafe, setUrlSafe] = React.useState(false);
  const [input, setInput] = React.useState("");

  const debouncedInput = useDebounce(input, 150);

  // Derived synchronously — no effect needed.
  const { output, error } = React.useMemo(
    () => convert(debouncedInput, mode, urlSafe),
    [debouncedInput, mode, urlSafe]
  );

  function swap() {
    setInput(output);
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  }

  const hasOutput = output.length > 0;

  const stats = hasOutput
    ? [
        { label: "Input size", value: `${byteLength(input)} B` },
        { label: "Output size", value: `${byteLength(output)} B` },
        {
          label: "Ratio",
          value: input
            ? `${((byteLength(output) / byteLength(input)) * 100).toFixed(0)}%`
            : "—",
        },
        { label: "Mode", value: mode === "encode" ? "Encode" : "Decode" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="split"
        controls={
          <ToolPanel
            title={mode === "encode" ? "Input — Plain text" : "Input — Base64"}
            action={
              <div className="flex items-center gap-3">
                <ToolField
                  label="URL-safe"
                  htmlFor="b64-urlsafe"
                  orientation="horizontal"
                  className="m-0"
                >
                  <Switch
                    id="b64-urlsafe"
                    checked={urlSafe}
                    onCheckedChange={setUrlSafe}
                  />
                </ToolField>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={swap}
                >
                  <ArrowLeftRight />
                  Swap
                </Button>
              </div>
            }
          >
            <Textarea
              id="b64-input"
              placeholder={
                mode === "encode"
                  ? "Paste text to encode…"
                  : "Paste Base64 to decode…"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-48 font-mono text-sm"
              spellCheck={false}
            />
            {error ? (
              <ValidationMessage status="error">{error}</ValidationMessage>
            ) : null}
          </ToolPanel>
        }
        output={
          <ToolPanel
            title={
              mode === "encode" ? "Output — Base64" : "Output — Plain text"
            }
          >
            <Textarea
              readOnly
              aria-live="polite"
              placeholder="Result appears here…"
              value={output}
              className="min-h-48 font-mono text-sm"
            />
            <ToolActionBar>
              <CopyButton value={output} disabled={!hasOutput} />
              <DownloadButton
                onDownload={() =>
                  downloadText(
                    output,
                    generateFileName(
                      mode === "encode" ? "encoded" : "decoded",
                      "txt"
                    )
                  )
                }
                label="Download"
                variant="outline"
                disabled={!hasOutput}
              />
            </ToolActionBar>
            <ToolStats stats={stats} columns={2} />
          </ToolPanel>
        }
      />
      <ToolPrivacyNotice />
    </div>
  );
}
