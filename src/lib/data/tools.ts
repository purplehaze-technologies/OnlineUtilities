import type { CategoryId, Tool } from "@/types";

/**
 * Single source of truth for every utility. Homepage, search, category pages,
 * related tools, navigation and the sitemap are all derived from this array.
 *
 * Adding a tool:
 *   1. Add an entry here (and an icon key in `lib/data/icons.ts`).
 *   2. Create `app/tools/<slug>/page.tsx` (copy an existing placeholder).
 * Everything else — listing, search, SEO, sitemap — updates automatically.
 *
 * `comingSoon: true` renders the polished placeholder. Flip it to `false`
 * once the tool's UI is implemented.
 */
export const tools: Tool[] = [
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    slug: "qr-code-generator",
    description:
      "Create custom QR codes for URLs, text, Wi-Fi and more — free and instant.",
    longDescription:
      "Generate high-resolution QR codes for links, plain text, contact cards, Wi-Fi credentials and more. Customize colors and download as PNG or SVG — all in your browser, with no sign-up.",
    category: "qr-barcode",
    icon: "qrcode",
    keywords: ["qr", "qr code", "generator", "url to qr", "wifi qr"],
    featured: true,
    comingSoon: false,
  },
  {
    id: "barcode-generator",
    name: "Barcode Generator",
    slug: "barcode-generator",
    description:
      "Generate EAN, UPC, Code128 and other barcodes ready to print.",
    category: "qr-barcode",
    icon: "barcode",
    keywords: ["barcode", "ean", "upc", "code128", "code39"],
    featured: false,
    comingSoon: true,
  },
  {
    id: "password-generator",
    name: "Password Generator",
    slug: "password-generator",
    description:
      "Build strong, random passwords with full control over length and characters.",
    category: "utilities",
    icon: "password",
    keywords: ["password", "random", "secure", "passphrase", "generator"],
    featured: true,
    comingSoon: true,
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    slug: "uuid-generator",
    description: "Generate v4 UUIDs / GUIDs in bulk, copy-ready.",
    category: "developer",
    icon: "uuid",
    keywords: ["uuid", "guid", "v4", "unique id", "identifier"],
    featured: false,
    comingSoon: true,
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Beautify, minify and validate JSON with instant error hints.",
    category: "developer",
    icon: "json",
    keywords: ["json", "formatter", "beautify", "minify", "validate", "pretty"],
    featured: true,
    comingSoon: true,
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description:
      "Decode and inspect JSON Web Tokens without sending data anywhere.",
    category: "developer",
    icon: "jwt",
    keywords: ["jwt", "json web token", "decode", "header", "payload"],
    featured: false,
    comingSoon: true,
  },
  {
    id: "base64-tools",
    name: "Base64 Encoder / Decoder",
    slug: "base64-tools",
    description: "Encode and decode Base64 text and files in one click.",
    category: "developer",
    icon: "base64",
    keywords: ["base64", "encode", "decode", "encoder", "decoder"],
    featured: true,
    comingSoon: true,
  },
  {
    id: "image-to-base64",
    name: "Image to Base64",
    slug: "image-to-base64",
    description: "Convert images into Base64 data URIs for inline embedding.",
    category: "image",
    icon: "image-base64",
    keywords: ["image", "base64", "data uri", "inline", "convert"],
    featured: false,
    comingSoon: true,
  },
  {
    id: "color-picker",
    name: "Color Picker",
    slug: "color-picker",
    description: "Pick colors and convert between HEX, RGB, HSL and OKLCH.",
    category: "image",
    icon: "color",
    keywords: ["color", "picker", "hex", "rgb", "hsl", "converter"],
    featured: true,
    comingSoon: true,
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    slug: "age-calculator",
    description: "Calculate exact age in years, months, weeks and days.",
    category: "calculators",
    icon: "age",
    keywords: ["age", "calculator", "birthday", "date difference"],
    featured: true,
    comingSoon: true,
  },
  {
    id: "gst-calculator",
    name: "GST Calculator",
    slug: "gst-calculator",
    description: "Add or remove GST and see the net, tax and gross amounts.",
    category: "calculators",
    icon: "gst",
    keywords: ["gst", "tax", "calculator", "vat", "india"],
    featured: false,
    comingSoon: true,
  },
  {
    id: "sip-calculator",
    name: "SIP Calculator",
    slug: "sip-calculator",
    description: "Estimate mutual-fund SIP returns with compounding.",
    category: "calculators",
    icon: "sip",
    keywords: ["sip", "mutual fund", "investment", "returns", "calculator"],
    featured: false,
    comingSoon: true,
  },
  {
    id: "emi-calculator",
    name: "EMI Calculator",
    slug: "emi-calculator",
    description: "Work out loan EMIs, total interest and amortization.",
    category: "calculators",
    icon: "emi",
    keywords: ["emi", "loan", "interest", "mortgage", "calculator"],
    featured: false,
    comingSoon: true,
  },
  {
    id: "word-counter",
    name: "Word Counter",
    slug: "word-counter",
    description: "Count words, characters, sentences and reading time live.",
    category: "text",
    icon: "word-counter",
    keywords: ["word", "counter", "characters", "reading time", "text"],
    featured: true,
    comingSoon: true,
  },
  {
    id: "case-converter",
    name: "Case Converter",
    slug: "case-converter",
    description:
      "Convert text to upper, lower, title, camel, snake and kebab case.",
    category: "text",
    icon: "case-converter",
    keywords: ["case", "converter", "uppercase", "lowercase", "title case"],
    featured: false,
    comingSoon: true,
  },
  {
    id: "markdown-previewer",
    name: "Markdown Previewer",
    slug: "markdown-previewer",
    description: "Write Markdown and preview the rendered HTML side by side.",
    category: "text",
    icon: "markdown",
    keywords: ["markdown", "preview", "md", "html", "editor"],
    featured: false,
    comingSoon: true,
  },
  {
    id: "meta-tag-generator",
    name: "Meta Tag Generator",
    slug: "meta-tag-generator",
    description: "Generate SEO, Open Graph and Twitter meta tags in seconds.",
    category: "seo",
    icon: "meta",
    keywords: ["meta", "tags", "seo", "open graph", "twitter card"],
    featured: true,
    comingSoon: true,
  },
  {
    id: "sitemap-generator",
    name: "Sitemap Generator",
    slug: "sitemap-generator",
    description: "Build an XML sitemap from a list of URLs for search engines.",
    category: "seo",
    icon: "sitemap",
    keywords: ["sitemap", "xml", "seo", "crawl", "generator"],
    featured: false,
    comingSoon: true,
  },
  {
    id: "schema-generator",
    name: "Schema Generator",
    slug: "schema-generator",
    description: "Create JSON-LD structured data for rich search results.",
    category: "seo",
    icon: "schema",
    keywords: ["schema", "json-ld", "structured data", "rich results", "seo"],
    featured: false,
    comingSoon: true,
  },
  {
    id: "slug-generator",
    name: "Slug Generator",
    slug: "slug-generator",
    description: "Turn any title into a clean, URL-friendly slug.",
    category: "utilities",
    icon: "slug",
    keywords: ["slug", "url", "permalink", "seo", "generator"],
    featured: false,
    comingSoon: true,
  },
];

/* -------------------------------------------------------------------------- */
/* Derived lookups & queries                                                  */
/* -------------------------------------------------------------------------- */

const toolBySlug = new Map<string, Tool>(
  tools.map((tool) => [tool.slug, tool])
);

export function getToolBySlug(slug: string): Tool | undefined {
  return toolBySlug.get(slug);
}

export function getAllToolSlugs(): string[] {
  return tools.map((tool) => tool.slug);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter((tool) => tool.featured);
}

export function getToolsByCategory(category: CategoryId): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getToolCountByCategory(category: CategoryId): number {
  return getToolsByCategory(category).length;
}

/** Up to `limit` other tools in the same category, for "Related Tools". */
export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  return tools
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, limit);
}

/** A stable "popular" slice for the homepage. */
export function getPopularTools(limit = 8): Tool[] {
  return tools.slice(0, limit);
}

/**
 * Case-insensitive search across name, description, category and keywords.
 * Pure and synchronous — runs instantly on the in-memory dataset.
 */
export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter((tool) => {
    const haystack = [
      tool.name,
      tool.description,
      tool.category,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
