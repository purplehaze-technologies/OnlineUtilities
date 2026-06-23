import type { Metadata } from "next";

import { siteConfig } from "@/lib/constants/site";

interface CreateMetadataOptions {
  title?: string;
  description?: string;
  /** Path relative to the site root, e.g. "/tools/qr-code-generator". */
  path?: string;
  keywords?: string[];
  /**
   * Override the OG/Twitter image. When omitted, the file-based
   * `app/opengraph-image` / `app/twitter-image` convention supplies it.
   */
  image?: string;
  /** Prevent indexing (used for utility/legal pages if desired). */
  noindex?: boolean;
}

/**
 * Single factory for every route's metadata. Guarantees consistent titles,
 * canonical URLs, Open Graph and Twitter cards across the whole site.
 */
export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords = [],
  image,
  noindex = false,
}: CreateMetadataOptions = {}): Metadata {
  const resolvedTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;

  const canonical = path;

  return {
    title: resolvedTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical,
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: resolvedTitle,
      description,
      url: canonical,
      locale: siteConfig.locale,
      ...(image
        ? {
            images: [
              { url: image, width: 1200, height: 630, alt: resolvedTitle },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      ...(image ? { images: [image] } : {}),
      site: siteConfig.twitter.site,
      creator: siteConfig.twitter.handle,
    },
  };
}
