"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { CopyButton } from "@/components/tool/copy-button";
import { DownloadButton } from "@/components/tool/download-button";
import { StrengthMeter } from "@/components/tool/strength-meter";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { ValidationMessage } from "@/components/shared/validation-message";
import { downloadText, generateFileName } from "@/lib/utils";
import {
  buildCharset,
  generatePassword,
  analyzeStrength,
} from "@/lib/utils/password";
import { DEFAULT_PASSWORD_OPTIONS } from "@/lib/schemas/password-generator";
import type { PasswordOptions } from "@/lib/schemas/password-generator";

export function PasswordGenerator() {
  const [opts, setOpts] = React.useState<PasswordOptions>(
    DEFAULT_PASSWORD_OPTIONS
  );
  const [passwords, setPasswords] = React.useState<string[]>([]);

  const charset = buildCharset(opts);
  const noChars = charset.length === 0;
  const strength = analyzeStrength(charset.length, opts.length);

  function generate() {
    if (noChars) return;
    setPasswords(
      Array.from({ length: opts.count }, () =>
        generatePassword(charset, opts.length)
      )
    );
  }

  const set = <K extends keyof PasswordOptions>(k: K, v: PasswordOptions[K]) =>
    setOpts((prev) => ({ ...prev, [k]: v }));

  const hasResult = passwords.length > 0;
  const allText = passwords.join("\n");

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="sidebar"
        controls={
          <div className="space-y-4">
            <ToolPanel title="Settings">
              <ToolField
                label="Length"
                htmlFor="pw-length"
                labelAddon={`${opts.length} characters`}
              >
                <Slider
                  id="pw-length"
                  min={4}
                  max={128}
                  step={1}
                  value={opts.length}
                  onChange={(e) => set("length", Number(e.target.value))}
                />
              </ToolField>

              <ToolField label="How many" htmlFor="pw-count">
                <Select
                  id="pw-count"
                  value={String(opts.count)}
                  onChange={(e) => set("count", Number(e.target.value))}
                >
                  {[1, 2, 5, 10, 20].map((n) => (
                    <option key={n} value={n}>
                      {n === 1 ? "1 password" : `${n} passwords`}
                    </option>
                  ))}
                </Select>
              </ToolField>

              {(
                [
                  ["upper", "Uppercase (A–Z)"],
                  ["lower", "Lowercase (a–z)"],
                  ["numbers", "Numbers (0–9)"],
                  ["symbols", "Symbols (!@#…)"],
                  ["excludeSimilar", "Exclude similar (i, l, 1, O, 0)"],
                  ["excludeAmbiguous", "Exclude ambiguous ({ } [ ] …)"],
                ] as [keyof PasswordOptions, string][]
              ).map(([key, label]) => (
                <ToolField
                  key={key}
                  label={label}
                  htmlFor={`pw-${key}`}
                  orientation="horizontal"
                >
                  <Switch
                    id={`pw-${key}`}
                    checked={opts[key] as boolean}
                    onCheckedChange={(v) => set(key, v)}
                  />
                </ToolField>
              ))}

              {noChars && (
                <ValidationMessage status="error">
                  Enable at least one character type.
                </ValidationMessage>
              )}

              <StrengthMeter
                label={strength.label}
                level={strength.level}
                entropy={strength.entropy}
                crackTime={strength.crackTime}
              />

              <Button
                type="button"
                onClick={generate}
                disabled={noChars}
                className="w-full"
              >
                <RefreshCw />
                Generate
              </Button>
            </ToolPanel>
          </div>
        }
        output={
          <ToolPanel title="Generated Passwords">
            {hasResult ? (
              <ul
                className="space-y-2"
                aria-live="polite"
                aria-label="Generated passwords"
              >
                {passwords.map((pw, i) => (
                  <li
                    key={i}
                    className="bg-muted/40 flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                  >
                    <code className="min-w-0 flex-1 text-sm break-all">
                      {pw}
                    </code>
                    <CopyButton value={pw} iconOnly size="sm" variant="ghost" />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-muted/20 flex min-h-40 items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground text-sm">
                  Configure and click Generate
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
                onDownload={() =>
                  downloadText(allText, generateFileName("passwords", "txt"))
                }
                label="Download .txt"
                variant="outline"
                disabled={!hasResult}
              />
            </ToolActionBar>
          </ToolPanel>
        }
      />
      <ToolPrivacyNotice />
    </div>
  );
}
