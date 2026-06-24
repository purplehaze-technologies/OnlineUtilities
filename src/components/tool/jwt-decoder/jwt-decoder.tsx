"use client";

import * as React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { CopyButton } from "@/components/tool/copy-button";
import { CodeDisplay } from "@/components/tool/code-display";
import { ValidationMessage } from "@/components/shared/validation-message";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { useDebounce } from "@/hooks/use-debounce";
import { decodeJwt, formatUnixClaim } from "@/lib/schemas/jwt-decoder";

const CLAIM_LABELS: Record<string, string> = {
  sub: "Subject",
  iss: "Issuer",
  aud: "Audience",
  exp: "Expires",
  iat: "Issued at",
  nbf: "Not before",
  jti: "JWT ID",
};

function ClaimsTable({ payload }: { payload: Record<string, unknown> }) {
  const timeClaims = new Set(["exp", "iat", "nbf"]);
  const entries = Object.entries(payload).filter(([k]) => k in CLAIM_LABELS);
  if (entries.length === 0) return null;
  return (
    <dl className="divide-border divide-y rounded-lg border text-sm">
      {entries.map(([key, val]) => (
        <div key={key} className="flex flex-wrap gap-x-4 gap-y-0.5 px-4 py-2">
          <dt className="text-muted-foreground w-28 shrink-0 font-medium">
            {CLAIM_LABELS[key] ?? key}
          </dt>
          <dd className="font-mono">
            {timeClaims.has(key)
              ? (formatUnixClaim(val) ?? String(val))
              : String(val)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function DecodedSection({
  title,
  json,
}: {
  title: string;
  json: Record<string, unknown>;
}) {
  const formatted = JSON.stringify(json, null, 2);
  return (
    <ToolPanel title={title}>
      <CodeDisplay code={formatted} language="json" maxHeight={250} />
      <ToolActionBar>
        <CopyButton value={formatted} label="Copy JSON" />
      </ToolActionBar>
    </ToolPanel>
  );
}

export function JwtDecoder() {
  const [token, setToken] = React.useState("");
  const debounced = useDebounce(token, 200);

  // Derive decode result synchronously — no effect needed.
  const decoded = React.useMemo(
    () => (debounced.trim() ? decodeJwt(debounced) : null),
    [debounced]
  );

  const parts = decoded?.ok ? decoded.parts : null;
  const warnings = decoded?.ok ? decoded.warnings : [];
  const decodeError = decoded && !decoded.ok ? decoded.error : null;

  return (
    <div className="space-y-6">
      {/* Security disclaimer */}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm dark:border-amber-700 dark:bg-amber-950/30">
        <ShieldAlert
          className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
          aria-hidden
        />
        <p className="text-amber-800 dark:text-amber-300">
          Decoding only reveals the token&apos;s contents — it does{" "}
          <strong>not</strong> verify the signature or confirm authenticity.
          Never trust the claims without proper server-side verification.
        </p>
      </div>

      {/* Input */}
      <ToolPanel
        title="JWT Token"
        description="Paste your JWT below — everything stays in your browser."
      >
        <Textarea
          id="jwt-input"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="min-h-28 font-mono text-xs"
          spellCheck={false}
          autoComplete="off"
        />
        {decodeError ? (
          <ValidationMessage status="error">{decodeError}</ValidationMessage>
        ) : null}
        {warnings.map((w) => (
          <div
            key={w}
            className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {w}
          </div>
        ))}
      </ToolPanel>

      {parts ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <DecodedSection title="Header" json={parts.header} />
          <DecodedSection title="Payload" json={parts.payload} />
        </div>
      ) : null}

      {parts ? (
        <ToolPanel
          title="Registered Claims"
          description="Standard claims decoded and formatted for readability."
        >
          <ClaimsTable payload={parts.payload} />
        </ToolPanel>
      ) : null}

      {parts ? (
        <ToolPanel title="Signature">
          <p className="text-muted-foreground text-sm">
            <span className="font-mono break-all">{parts.signatureB64}</span>
          </p>
          <ValidationMessage status="info">
            The signature is displayed as-is. Verification requires the secret
            or public key on a trusted server — never client-side.
          </ValidationMessage>
        </ToolPanel>
      ) : null}

      <ToolPrivacyNotice />
    </div>
  );
}
