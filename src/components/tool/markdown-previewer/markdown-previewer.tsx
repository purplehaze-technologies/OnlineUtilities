"use client";

import * as React from "react";
import { Maximize2, Minimize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { CopyButton } from "@/components/tool/copy-button";
import { DownloadButton } from "@/components/tool/download-button";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { useDebounce } from "@/hooks/use-debounce";
import { downloadText, generateFileName } from "@/lib/utils";

const SAMPLE = `# Markdown Previewer

Write **Markdown** on the left and see the live preview here.

## Features

- Headings, paragraphs, lists
- **Bold**, *italic*, ~~strikethrough~~
- \`inline code\` and code blocks
- [Links](https://example.com) and images
- > Blockquotes
- Tables (see below)

## Example Table

| Tool | Category | Status |
|------|----------|--------|
| QR Generator | QR & Barcode | Live |
| Password Generator | Utilities | Live |

## Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

---

> "The best way to predict the future is to invent it." — Alan Kay
`;

export function MarkdownPreviewer() {
  const [markdown, setMarkdown] = React.useState(SAMPLE);
  const [preview, setPreview] = React.useState("");
  const [fullscreen, setFullscreen] = React.useState<
    "editor" | "preview" | null
  >(null);

  const debounced = useDebounce(markdown, 200);
  const hasContent = debounced.trim().length > 0;

  React.useEffect(() => {
    if (!debounced.trim()) return;
    let cancelled = false;
    import("marked")
      .then(({ marked }) => marked.parse(debounced))
      .then((html) => {
        if (!cancelled) setPreview(String(html));
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  function buildHtmlDoc() {
    return `<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>Document</title></head>\n<body>\n${preview}\n</body>\n</html>`;
  }

  return (
    <div className="space-y-4">
      <ToolActionBar label="Markdown actions" align="end">
        <CopyButton
          value={preview}
          label="Copy HTML"
          variant="outline"
          disabled={!hasContent}
        />
        <DownloadButton
          label="Download"
          variant="outline"
          formats={[
            {
              id: "html",
              label: "HTML document",
              extension: "html",
              mimeType: "text/html",
            },
            {
              id: "md",
              label: "Markdown source",
              extension: "md",
              mimeType: "text/markdown",
            },
          ]}
          onDownload={(fmt) => {
            if (fmt === "html") {
              downloadText(
                buildHtmlDoc(),
                generateFileName("document", "html"),
                "text/html"
              );
            } else {
              downloadText(
                markdown,
                generateFileName("document", "md"),
                "text/markdown"
              );
            }
          }}
          disabled={!hasContent}
        />
      </ToolActionBar>

      <div className={fullscreen ? "grid gap-6" : "grid gap-6 lg:grid-cols-2"}>
        {/* Editor */}
        {fullscreen !== "preview" && (
          <ToolPanel
            title="Editor"
            action={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFullscreen(fullscreen === "editor" ? null : "editor")
                }
                aria-label={
                  fullscreen === "editor"
                    ? "Exit fullscreen"
                    : "Fullscreen editor"
                }
              >
                {fullscreen === "editor" ? <Minimize2 /> : <Maximize2 />}
              </Button>
            }
          >
            <Textarea
              id="md-input"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[480px] font-mono text-sm"
              spellCheck={false}
              aria-label="Markdown source"
            />
          </ToolPanel>
        )}

        {/* Preview */}
        {fullscreen !== "editor" && (
          <ToolPanel
            title="Preview"
            action={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFullscreen(fullscreen === "preview" ? null : "preview")
                }
                aria-label={
                  fullscreen === "preview"
                    ? "Exit fullscreen"
                    : "Fullscreen preview"
                }
              >
                {fullscreen === "preview" ? <Minimize2 /> : <Maximize2 />}
              </Button>
            }
          >
            <div
              className="prose dark:prose-invert prose-sm min-h-[480px] max-w-none overflow-auto"
              aria-live="polite"
              aria-label="Rendered preview"
              dangerouslySetInnerHTML={{
                __html: hasContent ? preview : "",
              }}
            />
          </ToolPanel>
        )}
      </div>

      <ToolPrivacyNotice />
    </div>
  );
}
