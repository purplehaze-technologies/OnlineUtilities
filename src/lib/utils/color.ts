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

/* -------------------------------------------------------------------------- */
/* Color format types                                                          */
/* -------------------------------------------------------------------------- */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}
export interface HslColor {
  h: number;
  s: number;
  l: number;
}
export interface HsvColor {
  h: number;
  s: number;
  v: number;
}
export interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

/* -------------------------------------------------------------------------- */
/* Conversion utilities used by Color Picker and any future color-aware tool  */
/* -------------------------------------------------------------------------- */

/** Parse a 6-digit hex color into R/G/B channels (0–255). Returns null on invalid. */
export function hexToRgb(hex: string): RgbColor | null {
  const n = normalizeHex(hex);
  if (!isValidHex(n) || n.length !== 7) return null;
  return {
    r: parseInt(n.slice(1, 3), 16),
    g: parseInt(n.slice(3, 5), 16),
    b: parseInt(n.slice(5, 7), 16),
  };
}

/** Format R/G/B channels (0–255) as a lowercase 6-digit hex string. */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.round(Math.min(255, Math.max(0, v)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

/** R/G/B (0–255) → HSL (h: 0–360, s/l: 0–100). */
export function rgbToHsl(r: number, g: number, b: number): HslColor {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/** HSL (h: 0–360, s/l: 0–100) → R/G/B (0–255). */
export function hslToRgb(h: number, s: number, l: number): RgbColor {
  const hn = h / 360,
    sn = s / 100,
    ln = l / 100;
  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }
  function hue(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  return {
    r: Math.round(hue(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue(p, q, hn) * 255),
    b: Math.round(hue(p, q, hn - 1 / 3) * 255),
  };
}

/** R/G/B (0–255) → HSV (h: 0–360, s/v: 0–100). */
export function rgbToHsv(r: number, g: number, b: number): HsvColor {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const v = max,
    d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (max !== min) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

/** R/G/B (0–255) → CMYK (0–100 each). */
export function rgbToCmyk(r: number, g: number, b: number): CmykColor {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rn - k) / (1 - k)) * 100),
    m: Math.round(((1 - gn - k) / (1 - k)) * 100),
    y: Math.round(((1 - bn - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

/** Generate a random hex color. */
export function randomHex(): string {
  return rgbToHex(
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  );
}

/** WCAG level for a given contrast ratio: "AAA" | "AA" | "AA Large" | "Fail". */
export function wcagLevel(ratio: number): string {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}
