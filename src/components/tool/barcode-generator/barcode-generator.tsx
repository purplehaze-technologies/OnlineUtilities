"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { ToolPreview } from "@/components/tool/tool-preview";
import { ColorField } from "@/components/tool/color-field";
import { DownloadButton } from "@/components/tool/download-button";
import { CopyButton } from "@/components/tool/copy-button";
import { ValidationMessage } from "@/components/shared/validation-message";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { useDebounce } from "@/hooks/use-debounce";
import { downloadBlob, downloadText, generateFileName } from "@/lib/utils";
import { svgElementToPngDataUrl } from "@/lib/utils/svg";
import {
  BARCODE_FORMATS,
  BARCODE_FORMAT_META,
  DEFAULT_BARCODE,
} from "@/lib/schemas/barcode-generator";
import type {
  BarcodeInput,
  BarcodeFormat,
} from "@/lib/schemas/barcode-generator";
import type { DownloadFormat } from "@/types";

const DOWNLOAD_FORMATS: DownloadFormat[] = [
  {
    id: "svg",
    label: "SVG vector",
    extension: "svg",
    mimeType: "image/svg+xml",
  },
  { id: "png", label: "PNG image", extension: "png", mimeType: "image/png" },
];

export function BarcodeGenerator() {
  const [input, setInput] = React.useState<BarcodeInput>(DEFAULT_BARCODE);
  const [renderError, setRenderError] = React.useState<string | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const debounced = useDebounce(input, 250);

  const set = <K extends keyof BarcodeInput>(k: K, v: BarcodeInput[K]) =>
    setInput((prev) => ({ ...prev, [k]: v }));

  const hasValue = debounced.value.trim().length > 0;

  // Render barcode into the SVG ref whenever debounced input changes.
  React.useEffect(() => {
    if (!svgRef.current || !debounced.value.trim()) {
      setRenderError(null);
      return;
    }
    import("jsbarcode")
      .then(({ default: JsBarcode }) => {
        try {
          JsBarcode(svgRef.current!, debounced.value, {
            format: debounced.format,
            lineColor: debounced.foreground,
            background: debounced.background,
            displayValue: debounced.displayValue,
            margin: 16,
          });
          setRenderError(null);
        } catch (e) {
          setRenderError(
            e instanceof Error ? e.message : "Invalid value for this format"
          );
        }
      })
      .catch(() => setRenderError("Failed to load barcode library"));
  }, [debounced]);

  async function handleDownload(formatId?: string) {
    if (!svgRef.current || !hasValue) return;
    const name = generateFileName("barcode", formatId ?? "svg");
    if (formatId === "png") {
      const pngUrl = await svgElementToPngDataUrl(svgRef.current, 3);
      const res = await fetch(pngUrl);
      const blob = await res.blob();
      downloadBlob(blob, name);
    } else {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      downloadText(svgData, name, "image/svg+xml");
    }
  }

  function getSvgText(): string {
    if (!svgRef.current) return "";
    return new XMLSerializer().serializeToString(svgRef.current);
  }

  const fmt = BARCODE_FORMAT_META[input.format];

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="sidebar"
        controls={
          <ToolPanel title="Settings">
            <ToolField label="Format" htmlFor="bc-format">
              <Select
                id="bc-format"
                value={input.format}
                onChange={(e) => set("format", e.target.value as BarcodeFormat)}
              >
                {BARCODE_FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {BARCODE_FORMAT_META[f].label}
                  </option>
                ))}
              </Select>
              <p className="text-muted-foreground text-xs">{fmt.hint}</p>
            </ToolField>

            <ToolField
              label="Value"
              htmlFor="bc-value"
              error={renderError ?? undefined}
              hint={`Example: ${fmt.example}`}
            >
              <Input
                id="bc-value"
                value={input.value}
                placeholder={fmt.example}
                onChange={(e) => set("value", e.target.value)}
                spellCheck={false}
              />
            </ToolField>

            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField label="Bar colour" htmlFor="bc-fg">
                <ColorField
                  id="bc-fg"
                  value={input.foreground}
                  onChange={(hex) => set("foreground", hex)}
                />
              </ToolField>
              <ToolField label="Background" htmlFor="bc-bg">
                <ColorField
                  id="bc-bg"
                  value={input.background}
                  onChange={(hex) => set("background", hex)}
                />
              </ToolField>
            </div>

            <ToolField
              label="Show text below"
              htmlFor="bc-display-value"
              orientation="horizontal"
            >
              <Switch
                id="bc-display-value"
                checked={input.displayValue}
                onCheckedChange={(v) => set("displayValue", v)}
              />
            </ToolField>
          </ToolPanel>
        }
        output={
          <ToolPanel title="Preview">
            <ToolPreview
              isEmpty={!hasValue || !!renderError}
              emptyTitle="Barcode preview"
              emptyDescription="Enter a value on the left to generate a barcode."
              checkerboard
            >
              {/* SVG is always in the DOM; JsBarcode writes into it directly. */}
              <svg ref={svgRef} aria-label="Generated barcode" />
            </ToolPreview>

            {renderError && hasValue ? (
              <ValidationMessage status="error">
                {renderError}
              </ValidationMessage>
            ) : null}

            <ToolActionBar align="center">
              <DownloadButton
                onDownload={handleDownload}
                formats={DOWNLOAD_FORMATS}
                disabled={!hasValue || !!renderError}
              />
              <CopyButton
                value={getSvgText}
                label="Copy SVG"
                variant="outline"
                disabled={!hasValue || !!renderError}
              />
            </ToolActionBar>
          </ToolPanel>
        }
      />
      <ToolPrivacyNotice />
    </div>
  );
}
