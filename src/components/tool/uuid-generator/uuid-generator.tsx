"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { CopyButton } from "@/components/tool/copy-button";
import { DownloadButton } from "@/components/tool/download-button";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { ToolStats } from "@/components/tool/tool-stats";
import { CodeDisplay } from "@/components/tool/code-display";
import { downloadText, generateFileName } from "@/lib/utils";
import { generateUuids } from "@/lib/utils/uuid";
import {
  DEFAULT_UUID_OPTIONS,
  UUID_COUNTS,
} from "@/lib/schemas/uuid-generator";
import type { UuidOptions, UuidVersion } from "@/lib/schemas/uuid-generator";

const VERSION_META: Record<
  UuidVersion,
  { label: string; description: string }
> = {
  4: {
    label: "v4 — Random",
    description: "Cryptographically random, the most common format.",
  },
  7: {
    label: "v7 — Time-ordered",
    description: "Timestamp-prefixed, sortable by creation time.",
  },
};

export function UuidGenerator() {
  const [options, setOptions] =
    React.useState<UuidOptions>(DEFAULT_UUID_OPTIONS);
  const [uuids, setUuids] = React.useState<string[]>([]);

  function generate() {
    setUuids(generateUuids(options.version, options.count));
  }

  function handleDownload() {
    downloadText(
      uuids.join("\n"),
      generateFileName("uuids", "txt"),
      "text/plain"
    );
  }

  const hasResult = uuids.length > 0;
  const allText = uuids.join("\n");

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="sidebar"
        controls={
          <ToolPanel title="Settings">
            <ToolField label="Version" htmlFor="uuid-version">
              <Select
                id="uuid-version"
                value={String(options.version)}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    version: Number(e.target.value) as UuidVersion,
                  }))
                }
              >
                {([4, 7] as UuidVersion[]).map((v) => (
                  <option key={v} value={String(v)}>
                    {VERSION_META[v].label}
                  </option>
                ))}
              </Select>
              <p className="text-muted-foreground text-xs">
                {VERSION_META[options.version].description}
              </p>
            </ToolField>

            <ToolField label="Count" htmlFor="uuid-count">
              <Select
                id="uuid-count"
                value={String(options.count)}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    count: Number(e.target.value),
                  }))
                }
              >
                {UUID_COUNTS.map((n) => (
                  <option key={n} value={String(n)}>
                    {n === 1 ? "1 UUID" : `${n} UUIDs`}
                  </option>
                ))}
              </Select>
            </ToolField>

            <Button type="button" onClick={generate} className="w-full">
              <RefreshCw />
              Generate
            </Button>
          </ToolPanel>
        }
        output={
          <ToolPanel title="Result">
            {hasResult ? (
              <CodeDisplay code={allText} language="text" maxHeight={400} />
            ) : (
              <div className="bg-muted/20 flex min-h-40 items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground text-sm">
                  Click Generate to produce UUIDs
                </p>
              </div>
            )}

            <ToolActionBar>
              <CopyButton
                value={allText}
                label="Copy all"
                disabled={!hasResult}
              />
              <DownloadButton
                onDownload={handleDownload}
                label="Download .txt"
                disabled={!hasResult}
                variant="outline"
              />
            </ToolActionBar>

            {hasResult && (
              <ToolStats
                columns={2}
                stats={[
                  { label: "Count", value: uuids.length },
                  { label: "Version", value: `v${options.version}` },
                ]}
              />
            )}
          </ToolPanel>
        }
      />
      <ToolPrivacyNotice />
    </div>
  );
}
