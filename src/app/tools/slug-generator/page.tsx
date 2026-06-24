import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { SlugGenerator } from "@/components/tool/slug-generator/slug-generator";
const SLUG = "slug-generator";
const faqs: Faq[] = [
  {
    question: "What is a URL slug?",
    answer:
      "The slug is the human-readable part of a URL that identifies a specific page, for example /my-blog-post in https://example.com/my-blog-post.",
  },
  {
    question: "Should I use dashes or underscores in slugs?",
    answer:
      "Google recommends hyphens (dashes) as word separators. Underscores are treated as part of the word, which can hurt ranking for multi-word phrases.",
  },
  {
    question: "What does remove stop words do?",
    answer:
      "It strips common filler words like the, and, a, of from the slug to make it shorter and more keyword-focused.",
  },
  {
    question: "Are accented characters handled?",
    answer:
      "Yes. Accented characters are normalized using Unicode NFKD decomposition, then diacritics are stripped, producing ASCII-safe slugs.",
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
      <SlugGenerator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
