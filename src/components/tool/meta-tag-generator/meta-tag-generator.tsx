"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { CopyButton } from "@/components/tool/copy-button";
import { DownloadButton } from "@/components/tool/download-button";
import { CodeDisplay } from "@/components/tool/code-display";
import { ValidationMessage } from "@/components/shared/validation-message";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { downloadText, generateFileName } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MetaFields {
  title: string;
  description: string;
  keywords: string;
  robots: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

const DEFAULTS: MetaFields = {
  title: "",
  description: "",
  keywords: "",
  robots: "index, follow",
  canonical: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogUrl: "",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
};

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function generateMetaTags(f: MetaFields): string {
  const lines: string[] = ["<!-- Primary Meta Tags -->"];
  if (f.title) lines.push(`<title>${escapeHtml(f.title)}</title>`);
  if (f.description)
    lines.push(
      `<meta name="description" content="${escapeHtml(f.description)}" />`
    );
  if (f.keywords)
    lines.push(`<meta name="keywords" content="${escapeHtml(f.keywords)}" />`);
  if (f.robots)
    lines.push(`<meta name="robots" content="${escapeHtml(f.robots)}" />`);
  if (f.canonical)
    lines.push(`<link rel="canonical" href="${escapeHtml(f.canonical)}" />`);

  const ogLines: string[] = [];
  const ogTitle = f.ogTitle || f.title;
  const ogDesc = f.ogDescription || f.description;
  const ogUrl = f.ogUrl || f.canonical;
  if (ogTitle)
    ogLines.push(
      `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`
    );
  if (ogDesc)
    ogLines.push(
      `<meta property="og:description" content="${escapeHtml(ogDesc)}" />`
    );
  if (f.ogType)
    ogLines.push(
      `<meta property="og:type" content="${escapeHtml(f.ogType)}" />`
    );
  if (ogUrl)
    ogLines.push(`<meta property="og:url" content="${escapeHtml(ogUrl)}" />`);
  if (f.ogImage)
    ogLines.push(
      `<meta property="og:image" content="${escapeHtml(f.ogImage)}" />`
    );
  if (ogLines.length) {
    lines.push("", "<!-- Open Graph / Facebook -->");
    lines.push(...ogLines);
  }

  const twLines: string[] = [];
  const twTitle = f.twitterTitle || ogTitle;
  const twDesc = f.twitterDescription || ogDesc;
  if (f.twitterCard)
    twLines.push(
      `<meta name="twitter:card" content="${escapeHtml(f.twitterCard)}" />`
    );
  if (twTitle)
    twLines.push(
      `<meta name="twitter:title" content="${escapeHtml(twTitle)}" />`
    );
  if (twDesc)
    twLines.push(
      `<meta name="twitter:description" content="${escapeHtml(twDesc)}" />`
    );
  const twImg = f.twitterImage || f.ogImage;
  if (twImg)
    twLines.push(
      `<meta name="twitter:image" content="${escapeHtml(twImg)}" />`
    );
  if (twLines.length) {
    lines.push("", "<!-- Twitter -->");
    lines.push(...twLines);
  }

  return lines.join("\n");
}

function LengthHint({
  value,
  min,
  max,
}: {
  value: string;
  min: number;
  max: number;
}) {
  const len = value.length;
  const ok = len >= min && len <= max;
  const over = len > max;
  return (
    <span
      className={cn(
        "text-xs",
        ok
          ? "text-emerald-600 dark:text-emerald-400"
          : over
            ? "text-destructive"
            : "text-muted-foreground"
      )}
    >
      {len}/{max}
    </span>
  );
}

export function MetaTagGenerator() {
  const [fields, setFields] = React.useState<MetaFields>(DEFAULTS);

  const set = <K extends keyof MetaFields>(k: K, v: string) =>
    setFields((prev) => ({ ...prev, [k]: v }));

  const output = React.useMemo(() => generateMetaTags(fields), [fields]);
  const hasOutput = output.replace(/<!--[\s\S]*?-->/g, "").trim().length > 0;

  const titleWarning =
    fields.title.length > 0 &&
    (fields.title.length < 30 || fields.title.length > 60);
  const descWarning =
    fields.description.length > 0 &&
    (fields.description.length < 120 || fields.description.length > 160);

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="split"
        stickyOutput={false}
        controls={
          <div className="space-y-4">
            <ToolPanel title="Primary">
              <ToolField
                label="Page title"
                htmlFor="mt-title"
                labelAddon={
                  <LengthHint value={fields.title} min={30} max={60} />
                }
              >
                <Input
                  id="mt-title"
                  placeholder="My Page Title — Site Name"
                  value={fields.title}
                  onChange={(e) => set("title", e.target.value)}
                />
                {titleWarning && (
                  <ValidationMessage status="warning">
                    Recommended: 30–60 characters for best SEO.
                  </ValidationMessage>
                )}
              </ToolField>

              <ToolField
                label="Description"
                htmlFor="mt-desc"
                labelAddon={
                  <LengthHint value={fields.description} min={120} max={160} />
                }
              >
                <Textarea
                  id="mt-desc"
                  placeholder="A clear, keyword-rich description of the page content."
                  value={fields.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="min-h-20"
                />
                {descWarning && (
                  <ValidationMessage status="warning">
                    Recommended: 120–160 characters.
                  </ValidationMessage>
                )}
              </ToolField>

              <ToolField
                label="Keywords"
                htmlFor="mt-kw"
                hint="Comma-separated. Optional in modern SEO."
              >
                <Input
                  id="mt-kw"
                  placeholder="keyword one, keyword two"
                  value={fields.keywords}
                  onChange={(e) => set("keywords", e.target.value)}
                />
              </ToolField>

              <ToolField label="Robots" htmlFor="mt-robots">
                <Select
                  id="mt-robots"
                  value={fields.robots}
                  onChange={(e) => set("robots", e.target.value)}
                >
                  <option>index, follow</option>
                  <option>noindex, follow</option>
                  <option>index, nofollow</option>
                  <option>noindex, nofollow</option>
                </Select>
              </ToolField>

              <ToolField label="Canonical URL" htmlFor="mt-canonical">
                <Input
                  id="mt-canonical"
                  type="url"
                  placeholder="https://example.com/page"
                  value={fields.canonical}
                  onChange={(e) => set("canonical", e.target.value)}
                />
              </ToolField>
            </ToolPanel>

            <ToolPanel title="Open Graph">
              <ToolField
                label="OG Title"
                htmlFor="mt-og-title"
                hint="Defaults to primary title."
              >
                <Input
                  id="mt-og-title"
                  placeholder="Override title for social sharing"
                  value={fields.ogTitle}
                  onChange={(e) => set("ogTitle", e.target.value)}
                />
              </ToolField>
              <ToolField label="OG Image URL" htmlFor="mt-og-img">
                <Input
                  id="mt-og-img"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={fields.ogImage}
                  onChange={(e) => set("ogImage", e.target.value)}
                />
              </ToolField>
              <ToolField label="OG Type" htmlFor="mt-og-type">
                <Select
                  id="mt-og-type"
                  value={fields.ogType}
                  onChange={(e) => set("ogType", e.target.value)}
                >
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="product">product</option>
                  <option value="profile">profile</option>
                </Select>
              </ToolField>
            </ToolPanel>

            <ToolPanel title="Twitter Card">
              <ToolField label="Card type" htmlFor="mt-tw-card">
                <Select
                  id="mt-tw-card"
                  value={fields.twitterCard}
                  onChange={(e) => set("twitterCard", e.target.value)}
                >
                  <option value="summary_large_image">
                    Summary large image
                  </option>
                  <option value="summary">Summary</option>
                  <option value="app">App</option>
                </Select>
              </ToolField>
            </ToolPanel>
          </div>
        }
        output={
          <ToolPanel
            title="Generated HTML"
            description="Paste this into your page's <head> section."
          >
            {hasOutput ? (
              <>
                <CodeDisplay code={output} language="text" maxHeight="none" />
                <ToolActionBar>
                  <CopyButton value={output} disabled={!hasOutput} />
                  <DownloadButton
                    onDownload={() =>
                      downloadText(
                        output,
                        generateFileName("meta-tags", "html"),
                        "text/html"
                      )
                    }
                    label="Download"
                    variant="outline"
                    disabled={!hasOutput}
                  />
                </ToolActionBar>
              </>
            ) : (
              <div className="bg-muted/20 flex min-h-48 items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground text-sm">
                  Fill in the form to generate tags
                </p>
              </div>
            )}
          </ToolPanel>
        }
      />
      <ToolPrivacyNotice />
    </div>
  );
}
