import type { Category, CategoryId } from "@/types";

/**
 * Single source of truth for categories. Category index pages, the homepage
 * grid, navigation and breadcrumbs all derive from this list.
 */
export const categories: Category[] = [
  {
    id: "qr-barcode",
    name: "QR & Barcode",
    slug: "qr-barcode",
    description: "Generate and scan QR codes and barcodes instantly.",
    icon: "qr-barcode",
  },
  {
    id: "developer",
    name: "Developer Tools",
    slug: "developer",
    description: "Formatters, decoders and generators for everyday dev work.",
    icon: "developer",
  },
  {
    id: "text",
    name: "Text Tools",
    slug: "text",
    description: "Count, convert and transform text with ease.",
    icon: "text",
  },
  {
    id: "seo",
    name: "SEO Tools",
    slug: "seo",
    description: "Meta tags, sitemaps and schema to boost your rankings.",
    icon: "seo",
  },
  {
    id: "image",
    name: "Image Tools",
    slug: "image",
    description: "Convert and process images directly in your browser.",
    icon: "image",
  },
  {
    id: "calculators",
    name: "Calculators",
    slug: "calculators",
    description: "Finance, date and everyday calculators that just work.",
    icon: "calculators",
  },
  {
    id: "converters",
    name: "Converters",
    slug: "converters",
    description: "Convert between formats, units and encodings.",
    icon: "converters",
  },
  {
    id: "utilities",
    name: "Utilities",
    slug: "utilities",
    description: "Handy everyday tools that don't fit anywhere else.",
    icon: "utilities",
  },
];

const categoryById = new Map<CategoryId, Category>(
  categories.map((category) => [category.id, category])
);

export function getCategory(id: CategoryId): Category | undefined {
  return categoryById.get(id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
