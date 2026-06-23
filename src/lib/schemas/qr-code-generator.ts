import { z } from "zod";

import { COLOR_DEFAULTS } from "@/lib/constants/tool";

/**
 * Validation + types for the QR Code Generator. Kept QR-specific on purpose:
 * the content-type union and Wi-Fi/SMS shapes only make sense for QR codes.
 * The rendering *options* (size/margin/colors/ecc) are intentionally generic
 * enough to inform a future shared `imageExportOptions`, but live here until a
 * second tool actually needs them (avoid premature abstraction).
 */

export const QR_CONTENT_TYPES = [
  "url",
  "text",
  "email",
  "phone",
  "sms",
  "wifi",
] as const;
export type QrContentType = (typeof QR_CONTENT_TYPES)[number];

export const WIFI_ENCRYPTIONS = ["WPA", "WEP", "nopass"] as const;
export type WifiEncryption = (typeof WIFI_ENCRYPTIONS)[number];

const nonEmpty = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

/** Discriminated union of everything a QR code can encode here. */
export const qrContentSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("url"),
    url: nonEmpty("URL").max(2000),
  }),
  z.object({
    type: z.literal("text"),
    text: nonEmpty("Text").max(2000),
  }),
  z.object({
    type: z.literal("email"),
    to: nonEmpty("Email address").email("Enter a valid email address"),
    subject: z.string().max(200).optional(),
    body: z.string().max(1000).optional(),
  }),
  z.object({
    type: z.literal("phone"),
    phone: nonEmpty("Phone number").max(32),
  }),
  z.object({
    type: z.literal("sms"),
    phone: nonEmpty("Phone number").max(32),
    message: z.string().max(500).optional(),
  }),
  z.object({
    type: z.literal("wifi"),
    ssid: nonEmpty("Network name (SSID)").max(64),
    password: z.string().max(64).optional(),
    encryption: z.enum(WIFI_ENCRYPTIONS).default("WPA"),
    hidden: z.boolean().default(false),
  }),
]);

export type QrContent = z.infer<typeof qrContentSchema>;

export const ERROR_CORRECTION_LEVELS = ["L", "M", "Q", "H"] as const;
export type ErrorCorrectionLevel = (typeof ERROR_CORRECTION_LEVELS)[number];

export const QR_SIZE = { min: 128, max: 1024, step: 16, default: 320 } as const;
export const QR_MARGIN = { min: 0, max: 10, step: 1, default: 2 } as const;

export const qrOptionsSchema = z.object({
  errorCorrectionLevel: z.enum(ERROR_CORRECTION_LEVELS).default("M"),
  size: z
    .number()
    .int()
    .min(QR_SIZE.min)
    .max(QR_SIZE.max)
    .default(QR_SIZE.default),
  margin: z
    .number()
    .int()
    .min(QR_MARGIN.min)
    .max(QR_MARGIN.max)
    .default(QR_MARGIN.default),
  foreground: z.string().default(COLOR_DEFAULTS.foreground),
  background: z.string().default(COLOR_DEFAULTS.background),
});

export type QrOptions = z.infer<typeof qrOptionsSchema>;

export const DEFAULT_QR_OPTIONS: QrOptions = {
  errorCorrectionLevel: "M",
  size: QR_SIZE.default,
  margin: QR_MARGIN.default,
  foreground: COLOR_DEFAULTS.foreground,
  background: COLOR_DEFAULTS.background,
};
