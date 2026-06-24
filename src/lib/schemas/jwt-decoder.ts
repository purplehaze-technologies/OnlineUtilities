import { decodeBase64Url } from "@/lib/utils/encoding";

export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signatureB64: string;
}

export type JwtDecodeResult =
  | { ok: true; parts: JwtParts; warnings: string[] }
  | { ok: false; error: string };

/** Decode a JWT string into its three parts. Never verifies the signature. */
export function decodeJwt(token: string): JwtDecodeResult {
  const trimmed = token.trim();
  const segments = trimmed.split(".");
  if (segments.length !== 3) {
    return {
      ok: false,
      error: "A JWT must have exactly three segments separated by dots.",
    };
  }
  const [rawHeader, rawPayload, signatureB64] = segments;
  try {
    const header = JSON.parse(decodeBase64Url(rawHeader)) as Record<
      string,
      unknown
    >;
    const payload = JSON.parse(decodeBase64Url(rawPayload)) as Record<
      string,
      unknown
    >;
    const warnings = buildWarnings(payload);
    return { ok: true, parts: { header, payload, signatureB64 }, warnings };
  } catch {
    return {
      ok: false,
      error:
        "Failed to decode token — it may be malformed or not a standard JWT.",
    };
  }
}

function buildWarnings(payload: Record<string, unknown>): string[] {
  const now = Math.floor(Date.now() / 1000);
  const warnings: string[] = [];
  if (typeof payload.exp === "number" && payload.exp < now) {
    warnings.push("This token has expired.");
  }
  if (typeof payload.nbf === "number" && payload.nbf > now) {
    warnings.push("This token is not yet valid (nbf is in the future).");
  }
  return warnings;
}

/** Format a Unix timestamp claim as a human-readable string. */
export function formatUnixClaim(ts: unknown): string | null {
  if (typeof ts !== "number") return null;
  return new Date(ts * 1000).toLocaleString();
}
