import type { QrOptions } from "@/lib/schemas/qr-code-generator";

/**
 * Thin wrappers over the `qrcode` library. The library is imported lazily with
 * a dynamic `import()` so it is code-split into its own chunk and only fetched
 * the first time a user actually generates a code (per the perf guidance on
 * heavy dependencies).
 */

function toLibraryOptions(options: QrOptions) {
  return {
    errorCorrectionLevel: options.errorCorrectionLevel,
    margin: options.margin,
    width: options.size,
    color: {
      dark: options.foreground,
      light: options.background,
    },
  } as const;
}

/** Render a QR code to a PNG data URL. */
export async function renderQrPng(
  payload: string,
  options: QrOptions
): Promise<string> {
  const { default: QRCode } = await import("qrcode");
  return QRCode.toDataURL(payload, toLibraryOptions(options));
}

/** Render a QR code to an SVG markup string. */
export async function renderQrSvg(
  payload: string,
  options: QrOptions
): Promise<string> {
  const { default: QRCode } = await import("qrcode");
  return QRCode.toString(payload, {
    type: "svg",
    ...toLibraryOptions(options),
  });
}
