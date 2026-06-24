"use client";

import * as React from "react";
import {
  FileJson,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { CopyButton } from "@/components/tool/copy-button";
import { DownloadButton } from "@/components/tool/download-button";
import { CodeDisplay } from "@/components/tool/code-display";
import { ToolStats } from "@/components/tool/tool-stats";
import { ValidationMessage } from "@/components/shared/validation-message";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { useFileReader } from "@/hooks/use-file-reader";
import { downloadText, generateFileName, byteLength } from "@/lib/utils";
import { processJson } from "@/lib/schemas/json-formatter";
import type {
  JsonOperation,
  JsonIndentSize,
} from "@/lib/schemas/json-formatter";

export function JsonFormatter() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [operation, setOperation] = React.useState<JsonOperation>("beautify");
  const [indentSize, setIndentSize] = React.useState<JsonIndentSize>(2);
  const [sortKeys, setSortKeys] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isValid, setIsValid] = React.useState<boolean | null>(null);

  const { state: fileState, read: readFile } = useFileReader();

  // Sync file content into the input textarea using "adjust during render"
  // instead of an effect to avoid the set-state-in-effect lint rule.
  const [lastFileResult, setLastFileResult] = React.useState<string | null>(
    null
  );
  if (fileState.status === "done" && fileState.result !== lastFileResult) {
    setLastFileResult(fileState.result);
    setInput(fileState.result);
  }

  function process(op: JsonOperation = operation) {
    if (!input.trim()) return;
    try {
      const result = processJson(input, {
        operation: op,
        indentSize,
        sortKeys,
      });
      setOutput(result);
      setError(null);
      setIsValid(true);
    } catch (e) {
      setOutput("");
      setIsValid(false);
      setError(
        e instanceof SyntaxError
          ? `JSON syntax error: ${e.message}`
          : "Unexpected processing error"
      );
    }
  }

  function handleOperation(op: JsonOperation) {
    setOperation(op);
    process(op);
  }

  const hasInput = input.trim().length > 0;
  const hasOutput = output.length > 0;

  const stats = hasOutput
    ? [
        { label: "Size (in)", value: `${byteLength(input)} B` },
        { label: "Size (out)", value: `${byteLength(output)} B` },
        { label: "Lines", value: output.split("\n").length },
        { label: "Keys", value: countKeys(output) },
      ]
    : [];

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="split"
        stickyOutput={false}
        controls={
          <ToolPanel
            title="Input JSON"
            action={
              <label className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild={false}
                  onClick={() => {
                    const el = document.createElement("input");
                    el.type = "file";
                    el.accept = ".json,application/json";
                    el.onchange = () => {
                      const f = el.files?.[0];
                      if (f) readFile(f, "text");
                    };
                    el.click();
                  }}
                >
                  <Upload className="size-4" />
                  Upload JSON
                </Button>
              </label>
            }
          >
            <Textarea
              id="json-input"
              placeholder='{ "hello": "world" }'
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setIsValid(null);
                setOutput("");
                setError(null);
              }}
              className="min-h-80 font-mono text-xs"
              spellCheck={false}
            />
            {error ? (
              <ValidationMessage status="error">{error}</ValidationMessage>
            ) : isValid === true ? (
              <ValidationMessage status="success">Valid JSON</ValidationMessage>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => handleOperation("beautify")}
                disabled={!hasInput}
                variant={operation === "beautify" ? "default" : "outline"}
                size="sm"
              >
                <Maximize2 />
                Beautify
              </Button>
              <Button
                type="button"
                onClick={() => handleOperation("minify")}
                disabled={!hasInput}
                variant={operation === "minify" ? "default" : "outline"}
                size="sm"
              >
                <Minimize2 />
                Minify
              </Button>
              <Button
                type="button"
                onClick={() => handleOperation("validate")}
                disabled={!hasInput}
                variant="outline"
                size="sm"
              >
                <CheckCircle2 />
                Validate
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <ToolField
                label="Indent"
                htmlFor="json-indent"
                className="m-0 w-28"
              >
                <Select
                  id="json-indent"
                  value={String(indentSize)}
                  onChange={(e) =>
                    setIndentSize(Number(e.target.value) as JsonIndentSize)
                  }
                >
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </Select>
              </ToolField>
              <ToolField
                label="Sort keys"
                htmlFor="json-sort"
                orientation="horizontal"
                className="m-0"
              >
                <Switch
                  id="json-sort"
                  checked={sortKeys}
                  onCheckedChange={setSortKeys}
                />
              </ToolField>
            </div>
          </ToolPanel>
        }
        output={
          <ToolPanel title="Output" icon="file-json">
            {hasOutput ? (
              <CodeDisplay
                code={output}
                language={operation !== "minify" ? "json" : "text"}
                maxHeight={500}
                lineNumbers={operation !== "minify"}
              />
            ) : (
              <div className="bg-muted/20 flex min-h-48 items-center justify-center rounded-xl border border-dashed">
                <div className="flex flex-col items-center gap-2 text-center">
                  <FileJson className="text-muted-foreground size-8" />
                  <p className="text-muted-foreground text-sm">
                    Result appears here
                  </p>
                </div>
              </div>
            )}

            <ToolActionBar>
              <CopyButton value={output} disabled={!hasOutput} />
              <DownloadButton
                onDownload={() =>
                  downloadText(
                    output,
                    generateFileName("formatted", "json"),
                    "application/json"
                  )
                }
                label="Download .json"
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

function countKeys(json: string): number {
  try {
    return JSON.stringify(JSON.parse(json)).match(/"[^"]+"\s*:/g)?.length ?? 0;
  } catch {
    return 0;
  }
}
