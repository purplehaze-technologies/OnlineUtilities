"use client";

import * as React from "react";
import { Link2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { CopyButton } from "@/components/tool/copy-button";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { useDebounce } from "@/hooks/use-debounce";
import { slugifyAdvanced, DEFAULT_SLUG_OPTIONS } from "@/lib/utils/text";
import type { SlugOptions } from "@/lib/utils/text";

export function SlugGenerator() {
  const [input, setInput] = React.useState("");
  const [opts, setOpts] = React.useState<SlugOptions>(DEFAULT_SLUG_OPTIONS);

  const debounced = useDebounce(input, 150);
  const slug = React.useMemo(
    () => (debounced ? slugifyAdvanced(debounced, opts) : ""),
    [debounced, opts]
  );

  const set = <K extends keyof SlugOptions>(k: K, v: SlugOptions[K]) =>
    setOpts((prev) => ({ ...prev, [k]: v }));

  const hasSlug = slug.length > 0;

  return (
    <div className="space-y-6">
      <ToolPanel title="Input">
        <ToolField label="Text to slugify" htmlFor="slug-input">
          <Input
            id="slug-input"
            placeholder="My Awesome Blog Post Title"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </ToolField>
      </ToolPanel>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Options */}
        <ToolPanel title="Options">
          <ToolField label="Separator" htmlFor="slug-sep">
            <Select
              id="slug-sep"
              value={opts.separator}
              onChange={(e) =>
                set("separator", e.target.value as SlugOptions["separator"])
              }
            >
              <option value="-">Dash (hello-world)</option>
              <option value="_">Underscore (hello_world)</option>
              <option value=".">Dot (hello.world)</option>
            </Select>
          </ToolField>

          <ToolField
            label="Lowercase"
            htmlFor="slug-lower"
            orientation="horizontal"
          >
            <Switch
              id="slug-lower"
              checked={opts.lowercase}
              onCheckedChange={(v) => set("lowercase", v)}
            />
          </ToolField>

          <ToolField
            label="Remove stop words"
            htmlFor="slug-stop"
            description="Strips common words like 'the', 'and', 'a', etc."
            orientation="horizontal"
          >
            <Switch
              id="slug-stop"
              checked={opts.removeStopWords}
              onCheckedChange={(v) => set("removeStopWords", v)}
            />
          </ToolField>
        </ToolPanel>

        {/* Result */}
        <ToolPanel title="Slug">
          {hasSlug ? (
            <>
              <div className="bg-muted/40 flex items-center gap-3 rounded-lg border px-4 py-3">
                <Link2
                  className="text-muted-foreground size-4 shrink-0"
                  aria-hidden
                />
                <span className="min-w-0 flex-1 font-mono text-sm break-all">
                  {slug}
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                Preview URL:{" "}
                <span className="font-mono">https://example.com/{slug}</span>
              </p>
              <ToolActionBar>
                <CopyButton value={slug} disabled={!hasSlug} />
              </ToolActionBar>
            </>
          ) : (
            <div className="bg-muted/20 flex min-h-32 items-center justify-center rounded-xl border border-dashed">
              <p className="text-muted-foreground text-sm">
                Slug preview appears here
              </p>
            </div>
          )}
        </ToolPanel>
      </div>

      <ToolPrivacyNotice />
    </div>
  );
}
