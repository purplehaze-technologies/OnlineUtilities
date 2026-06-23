"use client";

import * as React from "react";
import {
  Link2,
  Mail,
  MessageSquare,
  Phone,
  RotateCcw,
  Type,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { ToolPreview } from "@/components/tool/tool-preview";
import { ToolStats } from "@/components/tool/tool-stats";
import { ColorField } from "@/components/tool/color-field";
import { CopyButton } from "@/components/tool/copy-button";
import { DownloadButton } from "@/components/tool/download-button";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { ValidationMessage } from "@/components/shared/validation-message";

import { useDebounce } from "@/hooks/use-debounce";
import { downloadUrl, downloadText, generateFileName } from "@/lib/utils";
import type { DownloadFormat } from "@/types";
import {
  DEFAULT_QR_OPTIONS,
  ERROR_CORRECTION_LEVELS,
  QR_CONTENT_TYPES,
  QR_MARGIN,
  QR_SIZE,
  qrContentSchema,
  type ErrorCorrectionLevel,
  type QrContent,
  type QrContentType,
  type QrOptions,
} from "@/lib/schemas/qr-code-generator";
import { buildQrPayload } from "@/lib/qr/content";
import { renderQrPng, renderQrSvg } from "@/lib/qr/render";
import {
  INITIAL_QR_FIELDS,
  QrContentForm,
  type QrFields,
} from "./content-form";

const CONTENT_TYPE_META: Record<
  QrContentType,
  { label: string; icon: LucideIcon }
> = {
  url: { label: "URL", icon: Link2 },
  text: { label: "Text", icon: Type },
  email: { label: "Email", icon: Mail },
  phone: { label: "Phone", icon: Phone },
  sms: { label: "SMS", icon: MessageSquare },
  wifi: { label: "Wi-Fi", icon: Wifi },
};

const ECC_LABELS: Record<ErrorCorrectionLevel, string> = {
  L: "Low (7%)",
  M: "Medium (15%)",
  Q: "Quartile (25%)",
  H: "High (30%)",
};

const DOWNLOAD_FORMATS: DownloadFormat[] = [
  { id: "png", label: "PNG image", extension: "png", mimeType: "image/png" },
  {
    id: "svg",
    label: "SVG vector",
    extension: "svg",
    mimeType: "image/svg+xml",
  },
  {
    id: "base64",
    label: "Base64 (.txt)",
    extension: "txt",
    mimeType: "text/plain",
  },
];

function buildRawContent(type: QrContentType, f: QrFields): QrContent {
  switch (type) {
    case "url":
      return { type, url: f.url };
    case "text":
      return { type, text: f.text };
    case "email":
      return {
        type,
        to: f.emailTo,
        subject: f.emailSubject || undefined,
        body: f.emailBody || undefined,
      };
    case "phone":
      return { type, phone: f.phone };
    case "sms":
      return { type, phone: f.smsPhone, message: f.smsMessage || undefined };
    case "wifi":
      return {
        type,
        ssid: f.wifiSsid,
        password: f.wifiPassword || undefined,
        encryption: f.wifiEncryption,
        hidden: f.wifiHidden,
      };
  }
}

function hasInput(type: QrContentType, f: QrFields): boolean {
  switch (type) {
    case "url":
      return f.url.trim().length > 0;
    case "text":
      return f.text.trim().length > 0;
    case "email":
      return f.emailTo.trim().length > 0;
    case "phone":
      return f.phone.trim().length > 0;
    case "sms":
      return f.smsPhone.trim().length > 0;
    case "wifi":
      return f.wifiSsid.trim().length > 0;
  }
}

export function QrCodeGenerator() {
  const [type, setType] = React.useState<QrContentType>("url");
  const [fields, setFields] = React.useState<QrFields>(INITIAL_QR_FIELDS);
  const [options, setOptions] = React.useState<QrOptions>(DEFAULT_QR_OPTIONS);
  const [pngUrl, setPngUrl] = React.useState<string | null>(null);
  const [renderError, setRenderError] = React.useState<string | null>(null);

  const setField = React.useCallback(
    <K extends keyof QrFields>(key: K, value: QrFields[K]) => {
      setFields((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setOption = React.useCallback(
    <K extends keyof QrOptions>(key: K, value: QrOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Validate the current content and derive the payload + field errors.
  const dirty = hasInput(type, fields);
  const parsed = qrContentSchema.safeParse(buildRawContent(type, fields));
  const payload = parsed.success ? buildQrPayload(parsed.data) : null;

  const fieldErrors: Partial<Record<string, string>> = {};
  if (dirty && !parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
  }

  // Debounce the inputs to the renderer so typing stays smooth.
  const debouncedPayload = useDebounce(payload, 250);
  const debouncedOptions = useDebounce(options, 250);

  React.useEffect(() => {
    // No valid input: leave the (gated) result state as-is and skip rendering.
    if (!debouncedPayload) return;
    let cancelled = false;
    renderQrPng(debouncedPayload, debouncedOptions)
      .then((url) => {
        if (!cancelled) {
          setPngUrl(url);
          setRenderError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRenderError("Couldn't generate a QR code for this input.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedPayload, debouncedOptions]);

  // Gate the result on the *current* payload so clearing the form immediately
  // returns the preview to its empty state even if a stale PNG lingers.
  const hasResult = Boolean(pngUrl && payload);

  async function handleDownload(formatId?: string) {
    if (!payload) return;
    if (formatId === "svg") {
      const svg = await renderQrSvg(payload, options);
      downloadText(svg, generateFileName("qr-code", "svg"), "image/svg+xml");
      return;
    }
    if (!pngUrl) return;
    if (formatId === "base64") {
      // pngUrl is already a `data:image/png;base64,…` URI.
      downloadText(pngUrl, generateFileName("qr-code", "txt"), "text/plain");
      return;
    }
    downloadUrl(pngUrl, generateFileName("qr-code", "png"));
  }

  function handleReset() {
    setFields(INITIAL_QR_FIELDS);
    setOptions(DEFAULT_QR_OPTIONS);
    setType("url");
  }

  const stats = hasResult
    ? [
        { label: "Characters", value: payload!.length, icon: "word-counter" },
        { label: "Size", value: `${options.size}px`, icon: "image" },
        {
          label: "Error correction",
          value: options.errorCorrectionLevel,
          icon: "qrcode",
        },
        {
          label: "Type",
          value: CONTENT_TYPE_META[type].label,
          icon: type === "url" ? "slug" : "json",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="sidebar"
        controls={
          <div className="space-y-6">
            <ToolPanel
              title="Content"
              description="Choose what your QR code should contain."
            >
              <div
                role="tablist"
                aria-label="QR content type"
                className="flex flex-wrap gap-2"
              >
                {QR_CONTENT_TYPES.map((t) => {
                  const meta = CONTENT_TYPE_META[t];
                  const active = t === type;
                  return (
                    <Button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      variant={active ? "default" : "outline"}
                      size="sm"
                      onClick={() => setType(t)}
                    >
                      <meta.icon />
                      {meta.label}
                    </Button>
                  );
                })}
              </div>

              <QrContentForm
                type={type}
                fields={fields}
                onChange={setField}
                errors={fieldErrors}
              />
            </ToolPanel>

            <ToolPanel
              title="Customize"
              description="Tune the look and resilience of your code."
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                >
                  <RotateCcw />
                  Reset
                </Button>
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <ToolField label="Foreground" htmlFor="qr-fg">
                  <ColorField
                    id="qr-fg"
                    value={options.foreground}
                    onChange={(hex) => setOption("foreground", hex)}
                  />
                </ToolField>
                <ToolField label="Background" htmlFor="qr-bg">
                  <ColorField
                    id="qr-bg"
                    value={options.background}
                    onChange={(hex) => setOption("background", hex)}
                  />
                </ToolField>
              </div>

              <ToolField
                label="Size"
                htmlFor="qr-size"
                labelAddon={`${options.size}px`}
              >
                <Slider
                  id="qr-size"
                  min={QR_SIZE.min}
                  max={QR_SIZE.max}
                  step={QR_SIZE.step}
                  value={options.size}
                  onChange={(e) => setOption("size", Number(e.target.value))}
                />
              </ToolField>

              <ToolField
                label="Quiet zone (margin)"
                htmlFor="qr-margin"
                labelAddon={`${options.margin} modules`}
              >
                <Slider
                  id="qr-margin"
                  min={QR_MARGIN.min}
                  max={QR_MARGIN.max}
                  step={QR_MARGIN.step}
                  value={options.margin}
                  onChange={(e) => setOption("margin", Number(e.target.value))}
                />
              </ToolField>

              <ToolField
                label="Error correction"
                htmlFor="qr-ecc"
                hint="Higher levels stay scannable even if the code is partly obscured or has a logo."
              >
                <Select
                  id="qr-ecc"
                  value={options.errorCorrectionLevel}
                  onChange={(e) =>
                    setOption(
                      "errorCorrectionLevel",
                      e.target.value as ErrorCorrectionLevel
                    )
                  }
                >
                  {ERROR_CORRECTION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {ECC_LABELS[level]}
                    </option>
                  ))}
                </Select>
              </ToolField>
            </ToolPanel>
          </div>
        }
        output={
          <ToolPanel title="Your QR code">
            <ToolPreview
              isEmpty={!hasResult}
              checkerboard
              emptyTitle="Your QR code will appear here"
              emptyDescription="Enter content on the left to generate a scannable code instantly."
            >
              {pngUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- data: URL, not a static asset
                <img
                  src={pngUrl}
                  alt="Generated QR code"
                  width={options.size}
                  height={options.size}
                  className="h-auto w-full max-w-64 rounded"
                />
              ) : null}
            </ToolPreview>

            {renderError && payload ? (
              <ValidationMessage status="error">
                {renderError}
              </ValidationMessage>
            ) : null}

            <ToolActionBar align="center">
              <DownloadButton
                onDownload={handleDownload}
                formats={DOWNLOAD_FORMATS}
                disabled={!hasResult}
              />
              <CopyButton
                value={() => payload ?? ""}
                label="Copy content"
                disabled={!hasResult}
              />
              <CopyButton
                value={() => pngUrl ?? ""}
                label="Copy Base64"
                disabled={!hasResult}
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
