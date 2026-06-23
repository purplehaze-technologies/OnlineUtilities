/**
 * Color helpers shared by color-aware tools (QR/barcode generators, color
 * picker, meta-tag theme color). Framework-independent and unit-testable.
 */

/** True for `#rgb`, `#rgba`, `#rrggbb`, or `#rrggbbaa` hex strings. */
export function isValidHex(value: string): boolean {
  return /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
    value.trim()
  );
}

/**
 * Normalize a hex color to lowercase 6/8-digit form, expanding shorthand.
 * Returns the original (trimmed) string if it isn't valid hex.
 */
export function normalizeHex(value: string): string {
  const v = value.trim();
  if (!isValidHex(v)) return v;
  const hex = v.slice(1);
  const expanded =
    hex.length === 3 || hex.length === 4
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  return `#${expanded.toLowerCase()}`;
}

/** Relative luminance (WCAG) of a hex color, 0 (black) – 1 (white). */
export function relativeLuminance(hex: string): number {
  const normalized = normalizeHex(hex);
  if (!isValidHex(normalized)) return 0;
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(normalized.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio (1–21) between two hex colors. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}
