import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { SchemaGenerator } from "@/components/tool/schema-generator/schema-generator";
const SLUG = "schema-generator";
const faqs: Faq[] = [
  {
    question: "What is JSON-LD structured data?",
    answer:
      "JSON-LD is the recommended format for adding Schema.org structured data to your pages. Search engines use it to understand your content and show rich results.",
  },
  {
    question: "Which schema types are supported?",
    answer:
      "FAQ, Organization, Website, Article, Person, LocalBusiness, BreadcrumbList, and Product.",
  },
  {
    question: "Where do I paste the generated code?",
    answer:
      "Inside the head section of your HTML page. The script tag with type application/ld+json can appear anywhere in head or body.",
  },
  {
    question: "How do I validate my structured data?",
    answer:
      "Use Google's Rich Results Test or Schema.org's validator to check your generated code before deploying.",
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
      <SchemaGenerator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
