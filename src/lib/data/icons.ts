import {
  AlignLeft,
  ArrowLeftRight,
  Banknote,
  Barcode,
  Binary,
  Boxes,
  Braces,
  Calculator,
  Calendar,
  CaseSensitive,
  Code,
  FileCode,
  FileImage,
  FileJson,
  FileText,
  Fingerprint,
  Image,
  KeyRound,
  KeySquare,
  Link2,
  Network,
  Palette,
  Percent,
  QrCode,
  Search,
  Tags,
  TrendingUp,
  Type,
  Wrench,
} from "lucide-react";

import type { IconComponent } from "@/types";

/**
 * Central icon registry. Data files reference icons by string key so the data
 * stays serializable, while imports here keep Lucide fully tree-shakeable.
 */
export const iconRegistry = {
  // categories
  "qr-barcode": QrCode,
  developer: Code,
  text: Type,
  seo: Search,
  image: Image,
  calculators: Calculator,
  converters: ArrowLeftRight,
  utilities: Wrench,

  // tools
  qrcode: QrCode,
  barcode: Barcode,
  password: KeyRound,
  uuid: Fingerprint,
  json: Braces,
  jwt: KeySquare,
  base64: Binary,
  "image-base64": FileImage,
  color: Palette,
  age: Calendar,
  gst: Percent,
  sip: TrendingUp,
  emi: Banknote,
  "word-counter": AlignLeft,
  "case-converter": CaseSensitive,
  markdown: FileCode,
  meta: Tags,
  sitemap: Network,
  schema: Boxes,
  slug: Link2,
  "file-json": FileJson,
  "file-text": FileText,
} as const satisfies Record<string, IconComponent>;

export type IconKey = keyof typeof iconRegistry;

/** Resolve an icon key to its component, falling back to a generic wrench. */
export function getIcon(key: string): IconComponent {
  return (iconRegistry as Record<string, IconComponent>)[key] ?? Wrench;
}
