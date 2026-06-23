import type { LucideIcon } from "lucide-react";

/**
 * Stable category identifiers. Adding a category = add an id here and an entry
 * in `lib/data/categories.ts`. Tools reference categories by this union, so a
 * typo becomes a compile error rather than a broken page.
 */
export type CategoryId =
  | "qr-barcode"
  | "developer"
  | "text"
  | "seo"
  | "image"
  | "calculators"
  | "converters"
  | "utilities";

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  /** Key into the icon registry (`lib/data/icons.ts`). */
  icon: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Longer copy used on the tool's own landing page. */
  longDescription?: string;
  category: CategoryId;
  /** Key into the icon registry (`lib/data/icons.ts`). */
  icon: string;
  /** Extra search terms that aren't in the name/description. */
  keywords: string[];
  featured: boolean;
  comingSoon: boolean;
}

/** A resolved icon component, looked up from the registry by key. */
export type IconComponent = LucideIcon;

/* -------------------------------------------------------------------------- */
/* Shared tool-UI types (consumed by the generic tool primitives)             */
/* -------------------------------------------------------------------------- */

/** Severity for inline validation / feedback messages. */
export type ValidationStatus = "error" | "success" | "warning" | "info";

/** A single value rendered by the `ToolStats` statistics grid. */
export interface StatItem {
  /** Short label, e.g. "Words", "Size". */
  label: string;
  /** Display value — pre-formatted by the caller. */
  value: string | number;
  /** Optional icon registry key shown beside the value. */
  icon?: string;
  /** Optional supporting hint shown under the value. */
  hint?: string;
}

/** A selectable option for `ToolSelect` and option groups. */
export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
  /** Optional icon registry key. */
  icon?: string;
  disabled?: boolean;
}

/** A downloadable export format offered in a download menu. */
export interface DownloadFormat {
  /** Machine id, e.g. "png". */
  id: string;
  /** Human label, e.g. "PNG image". */
  label: string;
  /** File extension without the dot, e.g. "png". */
  extension: string;
  /** MIME type, e.g. "image/png". */
  mimeType: string;
}
