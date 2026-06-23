export { cn } from "./cn";
export {
  downloadBlob,
  downloadUrl,
  downloadText,
  generateFileName,
  formatBytes,
  byteLength,
} from "./file";
export { copyToClipboard, isClipboardSupported } from "./clipboard";
export {
  isValidHex,
  normalizeHex,
  relativeLuminance,
  contrastRatio,
} from "./color";

/**
 * Convert an arbitrary string into a URL-safe slug.
 * Shared by the slug-generator tool and internal helpers.
 */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Title-case a category id or any kebab/space separated string. */
export function titleCase(input: string): string {
  return input.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Format a number with locale-aware thousands separators. */
export function formatNumber(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(value);
}
