/**
 * Framework-independent file helpers shared by every tool that lets the user
 * save or name a result (QR generator, barcode, JSON formatter, schema/meta
 * generators, image-to-base64, …). Kept free of React so they can be unit
 * tested and reused anywhere.
 */

/** Trigger a browser download for an in-memory Blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  try {
    triggerDownload(url, filename);
  } finally {
    // Revoke on the next tick so the navigation has a chance to start.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

/** Trigger a browser download for a data: or blob: URL. */
export function downloadUrl(url: string, filename: string): void {
  triggerDownload(url, filename);
}

/** Download an arbitrary string as a file with the given MIME type. */
export function downloadText(
  text: string,
  filename: string,
  type = "text/plain"
): void {
  downloadBlob(new Blob([text], { type }), filename);
}

function triggerDownload(url: string, filename: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Build a safe, kebab-cased file name with an extension, e.g.
 * generateFileName("QR Code", "png") → "qr-code.png". An optional timestamp
 * keeps repeated downloads from overwriting each other.
 */
export function generateFileName(
  base: string,
  extension: string,
  { timestamp = false }: { timestamp?: boolean } = {}
): string {
  const safeBase =
    base
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "download";
  const ext = extension.replace(/^\.+/, "");
  const stamp = timestamp ? `-${Date.now()}` : "";
  return `${safeBase}${stamp}.${ext}`;
}

/** Human-readable byte size, e.g. formatBytes(2048) → "2 KB". */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, i);
  const rounded = i === 0 ? value : Number(value.toFixed(decimals));
  return `${rounded} ${units[i]}`;
}

/** Byte length of a UTF-8 string (matches what gets stored/transferred). */
export function byteLength(text: string): number {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(text).length;
  }
  // SSR / very old fallback.
  return unescape(encodeURIComponent(text)).length;
}
