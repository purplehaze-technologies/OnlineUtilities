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
