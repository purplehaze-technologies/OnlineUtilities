"use client";

import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/tool/tool-panel";
import { CopyButton } from "@/components/tool/copy-button";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { convertCase, CASE_TYPES, CASE_LABELS } from "@/lib/utils/text";
import { useDebounce } from "@/hooks/use-debounce";

export function CaseConverter() {
  const [input, setInput] = React.useState("");
  const debounced = useDebounce(input, 100);

  const results = React.useMemo(
    () =>
      CASE_TYPES.map((type) => ({
        type,
        label: CASE_LABELS[type],
        output: debounced ? convertCase(debounced, type) : "",
      })),
    [debounced]
  );

  const hasInput = debounced.trim().length > 0;

  return (
    <div className="space-y-6">
      <ToolPanel title="Input text">
        <Textarea
          id="cc-input"
          placeholder="Paste or type your text here…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-32 text-sm"
          aria-label="Text to convert"
        />
      </ToolPanel>

      <div className="grid gap-4 sm:grid-cols-2">
        {results.map(({ type, label, output }) => (
          <div
            key={type}
            className="bg-card rounded-xl border p-4 shadow-sm"
            aria-label={`${label} conversion`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {label}
              </span>
              <CopyButton
                value={output}
                iconOnly
                size="sm"
                variant="ghost"
                disabled={!hasInput}
              />
            </div>
            <p className="min-h-8 font-mono text-sm break-all">
              {output || (
                <span className="text-muted-foreground">
                  Preview appears here
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      <ToolPrivacyNotice />
    </div>
  );
}
