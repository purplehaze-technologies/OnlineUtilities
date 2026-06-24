/**
 * Text processing utilities. Framework-free; reused by Word Counter, Case
 * Converter, Slug Generator and any future text-manipulation tool.
 */

/* -------------------------------------------------------------------------- */
/* Word Counter                                                                 */
/* -------------------------------------------------------------------------- */

export interface TextStats {
  words: number;
  chars: number;
  charsNoSpace: number;
  sentences: number;
  paragraphs: number;
  /** Estimated reading time in minutes at 200 wpm. */
  readingMinutes: number;
  /** Estimated speaking time in minutes at 130 wpm. */
  speakingMinutes: number;
  longestWord: string;
  avgWordLength: number;
}

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  const wordList = trimmed ? (trimmed.match(/\b\w+\b/g) ?? []) : [];
  const words = wordList.length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = trimmed
    ? (trimmed.match(/[.!?]+(?:\s|$)/g)?.length ?? 0) || 1
    : 0;
  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length
    : 0;
  const readingMinutes = words / 200;
  const speakingMinutes = words / 130;
  const longestWord = wordList.reduce(
    (a, b) => (b.length > a.length ? b : a),
    ""
  );
  const avgWordLength =
    words === 0
      ? 0
      : Math.round(
          (wordList.reduce((sum, w) => sum + w.length, 0) / words) * 10
        ) / 10;

  return {
    words,
    chars,
    charsNoSpace,
    sentences,
    paragraphs,
    readingMinutes,
    speakingMinutes,
    longestWord,
    avgWordLength,
  };
}

const STOP_WORDS = new Set(
  "a an the and or but in on at to for of with by from up about into through is are was were be been being have has had do does did will would could should may might shall can i you he she it we they what which who that this these those".split(
    " "
  )
);

export interface KeywordEntry {
  word: string;
  count: number;
  density: number;
}

/** Top N most frequent non-stop-word keywords. */
export function topKeywords(text: string, limit = 8): KeywordEntry[] {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
  if (!words.length) return [];
  const freq = new Map<string, number>();
  for (const w of words) {
    if (!STOP_WORDS.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({
      word,
      count,
      density: (count / words.length) * 100,
    }));
}

/** Format a fractional number of minutes as "X min Y sec" or "< 1 sec". */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1 / 60) return "< 1 sec";
  const totalSec = Math.round(minutes * 60);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m === 0) return `${s} sec`;
  return s > 0 ? `${m} min ${s} sec` : `${m} min`;
}

/* -------------------------------------------------------------------------- */
/* Case Converter                                                              */
/* -------------------------------------------------------------------------- */

export const CASE_TYPES = [
  "upper",
  "lower",
  "title",
  "sentence",
  "camel",
  "pascal",
  "snake",
  "kebab",
  "constant",
  "dot",
] as const;

export type CaseType = (typeof CASE_TYPES)[number];

export const CASE_LABELS: Record<CaseType, string> = {
  upper: "UPPERCASE",
  lower: "lowercase",
  title: "Title Case",
  sentence: "Sentence case",
  camel: "camelCase",
  pascal: "PascalCase",
  snake: "snake_case",
  kebab: "kebab-case",
  constant: "CONSTANT_CASE",
  dot: "dot.case",
};

function words(text: string): string[] {
  return text.match(/[a-zA-Z0-9]+/g) ?? [];
}

export function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    case "sentence":
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case "camel":
      return words(text)
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("");
    case "pascal":
      return words(text)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("");
    case "snake":
      return words(text)
        .map((w) => w.toLowerCase())
        .join("_");
    case "kebab":
      return words(text)
        .map((w) => w.toLowerCase())
        .join("-");
    case "constant":
      return words(text)
        .map((w) => w.toUpperCase())
        .join("_");
    case "dot":
      return words(text)
        .map((w) => w.toLowerCase())
        .join(".");
  }
}

/* -------------------------------------------------------------------------- */
/* Slug Generator                                                              */
/* -------------------------------------------------------------------------- */

export interface SlugOptions {
  separator: "-" | "_" | ".";
  lowercase: boolean;
  removeStopWords: boolean;
}

export const DEFAULT_SLUG_OPTIONS: SlugOptions = {
  separator: "-",
  lowercase: true,
  removeStopWords: false,
};

/** Generate a URL-safe slug with configurable options. */
export function slugifyAdvanced(input: string, opts: SlugOptions): string {
  let text = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .trim();

  if (opts.lowercase) text = text.toLowerCase();

  const wordList = text.match(/[a-zA-Z0-9]+/g) ?? [];
  const filtered = opts.removeStopWords
    ? wordList.filter((w) => !STOP_WORDS.has(w.toLowerCase()))
    : wordList;

  return filtered.join(opts.separator);
}
