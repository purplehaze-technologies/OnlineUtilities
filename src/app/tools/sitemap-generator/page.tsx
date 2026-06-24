import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { SitemapGenerator } from "@/components/tool/sitemap-generator/sitemap-generator";
const SLUG = "sitemap-generator";
const faqs: Faq[] = [
  {
    question: "What is an XML sitemap?",
    answer:
      "A file listing all pages on your website so search engines can discover and crawl them efficiently. Especially useful for large sites or pages not well-linked internally.",
  },
  {
    question: "How do I submit my sitemap to Google?",
    answer:
      "Upload sitemap.xml to your website root and submit the URL in Google Search Console under Indexing > Sitemaps.",
  },
  {
    question: "What is the priority field?",
    answer:
      "A hint (0.0-1.0) to search engines about the relative importance of your pages. 1.0 is highest priority. It is advisory only.",
  },
  {
    question: "How many URLs can I add?",
    answer:
      "The Sitemaps protocol supports up to 50,000 URLs per file. For larger sites, split into multiple sitemaps and reference them via a sitemap index file.",
  },
];
export function generateMetadata(): Metadata {
  const tool = getToolBySlug(SLUG);
  if (!tool) return createMetadata({ path: `/tools/${SLUG}` });
  return createMetadata({
    title: tool.name,
    description: tool.description,
    path: `/tools/${tool.slug}`,
    keywords: tool.keywords,
  });
}
export default function Page() {
  const tool = getToolBySlug(SLUG);
  if (!tool) notFound();
  return (
    <ToolPageLayout tool={tool}>
      <SitemapGenerator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
