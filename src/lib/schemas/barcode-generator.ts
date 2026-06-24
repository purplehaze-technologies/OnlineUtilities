import { z } from "zod";

import { COLOR_DEFAULTS } from "@/lib/constants/tool";

export const BARCODE_FORMATS = [
  "CODE128",
  "EAN13",
  "EAN8",
  "UPC",
  "ITF14",
  "CODE39",
] as const;
export type BarcodeFormat = (typeof BARCODE_FORMATS)[number];

export const BARCODE_FORMAT_META: Record<
  BarcodeFormat,
  { label: string; hint: string; example: string }
> = {
  CODE128: {
    label: "Code 128",
    hint: "Any printable ASCII characters.",
    example: "Hello-World",
  },
  EAN13: {
    label: "EAN-13",
    hint: "Exactly 12 digits — the 13th check digit is auto-calculated.",
    example: "590123412345",
  },
  EAN8: {
    label: "EAN-8",
    hint: "Exactly 7 digits — the 8th check digit is auto-calculated.",
    example: "1234567",
  },
  UPC: {
    label: "UPC-A",
    hint: "Exactly 11 digits — the 12th check digit is auto-calculated.",
    example: "01234567890",
  },
  ITF14: {
    label: "ITF-14",
    hint: "Exactly 13 digits — the 14th check digit is auto-calculated.",
    example: "1234567890128",
  },
  CODE39: {
    label: "Code 39",
    hint: "Uppercase A–Z, digits 0–9, and - . $ / + % space.",
    example: "CODE-39",
  },
};

export const barcodeSchema = z.object({
  format: z.enum(BARCODE_FORMATS).default("CODE128"),
  value: z.string().trim().min(1, "Enter a value to encode"),
  foreground: z.string().default(COLOR_DEFAULTS.foreground),
  background: z.string().default(COLOR_DEFAULTS.background),
  displayValue: z.boolean().default(true),
});

export type BarcodeInput = z.infer<typeof barcodeSchema>;

export const DEFAULT_BARCODE: BarcodeInput = {
  format: "CODE128",
  value: "",
  foreground: COLOR_DEFAULTS.foreground,
  background: COLOR_DEFAULTS.background,
  displayValue: true,
};
