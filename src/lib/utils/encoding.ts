/**
 * UTF-8-aware Base64 helpers. Framework-free, reused by the Base64 tool, the
 * Image→Base64 tool, the JWT decoder (URL-safe decoding), and any future tool
 * that encodes/decodes text or binary data.
 */

/** Encode a UTF-8 string to standard Base64. */
export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binary);
}

/** Decode standard Base64 to a UTF-8 string. Throws on invalid input. */
export function decodeBase64(b64: string): string {
  const binary = atob(b64.trim()); // throws DOMException on invalid
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Convert standard Base64 to URL-safe Base64 (RFC 4648 §5).
 * Replaces `+` → `-`, `/` → `_`, strips `=` padding.
 */
export function toUrlSafeBase64(b64: string): string {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Convert URL-safe Base64 back to standard Base64.
 * Replaces `-` → `+`, `_` → `/`, re-adds padding.
 */
export function fromUrlSafeBase64(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = (4 - (b64.length % 4)) % 4;
  return b64 + "=".repeat(pad);
}

/** True when a string is plausibly valid standard Base64. */
export function isValidBase64(value: string): boolean {
  const clean = value.trim().replace(/\s/g, "");
  return /^[A-Za-z0-9+/]*={0,2}$/.test(clean) && clean.length % 4 === 0;
}

/** True when a string is plausibly valid URL-safe Base64. */
export function isValidBase64Url(value: string): boolean {
  const clean = value.trim().replace(/\s/g, "");
  return /^[A-Za-z0-9_-]*$/.test(clean);
}

/** Decode a URL-safe Base64 string to a UTF-8 string. Throws on invalid input. */
export function decodeBase64Url(b64url: string): string {
  return decodeBase64(fromUrlSafeBase64(b64url));
}
