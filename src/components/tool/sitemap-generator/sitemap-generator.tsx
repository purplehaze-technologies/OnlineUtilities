"use client";

import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

const CHANGE_FREQS = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
] as const;

function isValidUrl(u: string): boolean {
  try {
    new URL(u);
    return true;
  } catch {
    return false;
  }
}

function buildXml(
  urls: string[],
  priority: string,
  changefreq: string,
  lastmod: string
): string {
  const entries = urls
    .filter((u) => isValidUrl(u))
    .map((u) => {
      const lines = [`  <url>`, `    <loc>${u}</loc>`];
      if (priority) lines.push(`    <priority>${priority}</priority>`);
      if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
      if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
      lines.push(`  </url>`);
      return lines.join("\n");
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

export function SitemapGenerator() {
  const [rawUrls, setRawUrls] = React.useState("");
  const [priority, setPriority] = React.useState("0.8");
  const [changefreq, setChangefreq] = React.useState("weekly");
  const [lastmod, setLastmod] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  const urls = React.useMemo(
    () =>
      rawUrls
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean),
    [rawUrls]
  );

  const validUrls = urls.filter(isValidUrl);
  const invalidUrls = urls.filter((u) => !isValidUrl(u));

  const xml = React.useMemo(
    () =>
      validUrls.length > 0
        ? buildXml(validUrls, priority, changefreq, lastmod)
        : "",
    [validUrls, priority, changefreq, lastmod]
  );

  const hasXml = xml.length > 0;

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="split"
        stickyOutput={false}
        controls={
          <div className="space-y-4">
            <ToolPanel
              title="URLs"
              description="One URL per line. Must include the full URL with https://"
            >
              <Textarea
                id="sitemap-urls"
                placeholder={
                  "https://example.com/\nhttps://example.com/about\nhttps://example.com/blog"
                }
                value={rawUrls}
                onChange={(e) => setRawUrls(e.target.value)}
                className="min-h-48 font-mono text-sm"
                spellCheck={false}
              />
              {invalidUrls.length > 0 && (
                <ValidationMessage status="warning">
                  {invalidUrls.length} URL
                  {invalidUrls.length > 1 ? "s are" : " is"} invalid and will be
                  skipped: {invalidUrls.slice(0, 3).join(", ")}
                  {invalidUrls.length > 3 ? `…` : ""}
                </ValidationMessage>
              )}
            </ToolPanel>

            <ToolPanel title="Settings">
              <ToolField label="Priority" htmlFor="sm-priority">
                <Select
                  id="sm-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {["1.0", "0.9", "0.8", "0.7", "0.5", "0.3", "0.1"].map(
                    (v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    )
                  )}
                </Select>
              </ToolField>

              <ToolField label="Change frequency" htmlFor="sm-freq">
                <Select
                  id="sm-freq"
                  value={changefreq}
                  onChange={(e) => setChangefreq(e.target.value)}
                >
                  {CHANGE_FREQS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </Select>
              </ToolField>

              <ToolField label="Last modified" htmlFor="sm-lastmod">
                <Input
                  id="sm-lastmod"
                  type="date"
                  value={lastmod}
                  onChange={(e) => setLastmod(e.target.value)}
                />
              </ToolField>
            </ToolPanel>
          </div>
        }
        output={
          <ToolPanel
            title="sitemap.xml"
            description={
              hasXml
                ? `${validUrls.length} URL${validUrls.length !== 1 ? "s" : ""}`
                : undefined
            }
          >
            {hasXml ? (
              <>
                <CodeDisplay code={xml} language="text" maxHeight={500} />
                <ToolActionBar>
                  <CopyButton value={xml} disabled={!hasXml} />
                  <DownloadButton
                    onDownload={() =>
                      downloadText(
                        xml,
                        generateFileName("sitemap", "xml"),
                        "application/xml"
                      )
                    }
                    label="Download .xml"
                    variant="outline"
                    disabled={!hasXml}
                  />
                </ToolActionBar>
              </>
            ) : (
              <div className="bg-muted/20 flex min-h-48 items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground text-sm">
                  Enter URLs on the left to generate a sitemap
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
