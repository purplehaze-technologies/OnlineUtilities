/**
 * Password generation and strength analysis. Uses `crypto.getRandomValues` for
 * cryptographically secure randomness — no Math.random(). Shared by the
 * Password Generator tool; general enough for any future tool that needs
 * random string generation (token generator, API key tool, etc.).
 */

export const CHAR_SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
} as const;

/** Characters that look similar and cause readability confusion. */
const SIMILAR_CHARS = new Set("il1Lo0O");

/** Characters that can be ambiguous in some fonts / contexts. */
const AMBIGUOUS_CHARS = new Set("{}[]()/\\\"'`;:.,<>");

export interface PasswordOptions {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  upper: true,
  lower: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
};

/** Build the charset string from the given options. */
export function buildCharset(opts: PasswordOptions): string {
  let charset = "";
  if (opts.upper) charset += CHAR_SETS.upper;
  if (opts.lower) charset += CHAR_SETS.lower;
  if (opts.numbers) charset += CHAR_SETS.numbers;
  if (opts.symbols) charset += CHAR_SETS.symbols;
  if (opts.excludeSimilar) {
    charset = charset
      .split("")
      .filter((c) => !SIMILAR_CHARS.has(c))
      .join("");
  }
  if (opts.excludeAmbiguous) {
    charset = charset
      .split("")
      .filter((c) => !AMBIGUOUS_CHARS.has(c))
      .join("");
  }
  return charset;
}

/**
 * Generate a single password using `crypto.getRandomValues` for uniform random
 * index selection. Bias is negligible when charset.length << 2^32.
 */
export function generatePassword(charset: string, length: number): string {
  if (!charset) return "";
  const indices = new Uint32Array(length);
  crypto.getRandomValues(indices);
  return Array.from(indices, (n) => charset[n % charset.length]).join("");
}

/** Shannon entropy in bits: length × log2(charsetSize). */
export function calcEntropy(charsetSize: number, length: number): number {
  if (charsetSize <= 1 || length === 0) return 0;
  return length * Math.log2(charsetSize);
}

export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrength {
  level: StrengthLevel;
  label: string;
  entropy: number;
  crackTime: string;
}

const STRENGTH_LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];

/** Estimated crack time label assuming 10^10 guesses/second (GPU cluster). */
function crackTimeLabel(entropy: number): string {
  if (entropy <= 0) return "instantly";
  const seconds = Math.pow(2, Math.min(entropy, 300)) / 1e10;
  if (seconds < 1) return "instantly";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hr`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 3.154e9) return `${Math.round(seconds / 31536000)} yr`;
  if (seconds < 3.154e12) return `${Math.round(seconds / 3.154e9)}k yr`;
  if (seconds < 3.154e15) return `${Math.round(seconds / 3.154e12)}M yr`;
  return "practically forever";
}

export function analyzeStrength(
  charsetSize: number,
  length: number
): PasswordStrength {
  const entropy = calcEntropy(charsetSize, length);
  const level: StrengthLevel =
    entropy < 28
      ? 0
      : entropy < 36
        ? 1
        : entropy < 60
          ? 2
          : entropy < 128
            ? 3
            : 4;
  return {
    level,
    label: STRENGTH_LABELS[level],
    entropy: Math.round(entropy),
    crackTime: crackTimeLabel(entropy),
  };
}
