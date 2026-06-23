import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants/site";
import { tools } from "@/lib/data/tools";
import { categories } from "@/lib/data/categories";

/**
 * Native Next.js sitemap. Tool and category routes are derived from the data
 * files, so adding a tool automatically adds it to the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url;

  const staticRoutes = [
    "",
    "/tools",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${base}/categories/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: tool.featured ? 0.9 : 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...toolEntries];
}
