/**
 * Cross-tool constants. Anything that more than one utility relies on (privacy
 * copy, common color defaults, validation limits) lives here so individual
 * tools stay consistent and a single edit updates them all.
 */

/** Standard privacy reassurance shown on every in-browser tool. */
export const PRIVACY_NOTICE =
  "Everything runs entirely in your browser. Your data never leaves your device and nothing is uploaded to a server.";

/** Common color defaults reused by color-aware tools (QR, barcode, picker). */
export const COLOR_DEFAULTS = {
  foreground: "#000000",
  background: "#ffffff",
} as const;

/** Shared validation limits so tools cap input consistently. */
export const LIMITS = {
  /** Generous upper bound for single-line text inputs. */
  shortText: 2_000,
  /** Upper bound for multi-line / document inputs. */
  longText: 100_000,
} as const;

/** Transient feedback delay (ms) for "Copied!" / "Saved!" states. */
export const FEEDBACK_RESET_MS = 2_000;
