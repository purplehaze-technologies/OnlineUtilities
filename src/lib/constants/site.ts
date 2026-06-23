/**
 * Central site configuration. Changing the domain (Vercel → custom) is a single
 * env-var change; everything (metadata, canonical URLs, sitemap, JSON-LD) reads
 * from here.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  // Vercel provides this automatically for preview/production deployments.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "OnlineUtilities",
  shortName: "OnlineUtilities",
  url: resolveSiteUrl(),
  tagline: "Free Online Tools & Utilities",
  description:
    "A fast, modern suite of free online utilities — QR code generator, JSON formatter, password generator, calculators, converters and more. No sign-up, mobile-first, privacy-friendly.",
  locale: "en_US",
  author: "OnlineUtilities",
  /** Open Graph image served from `app/opengraph-image` or /public. */
  ogImage: "/opengraph-image.png",
  twitter: {
    handle: "@onlineutilities",
    site: "@onlineutilities",
  },
  links: {
    github: "https://github.com/your-org/online-utilities",
  },
  keywords: [
    "online tools",
    "free utilities",
    "qr code generator",
    "json formatter",
    "password generator",
    "developer tools",
    "calculators",
    "converters",
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Build an absolute URL from a path, using the configured site URL. */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
