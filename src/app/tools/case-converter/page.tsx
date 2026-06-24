import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { CaseConverter } from "@/components/tool/case-converter/case-converter";
const SLUG = "case-converter";
const faqs: Faq[] = [
  {
    question: "What cases does this tool support?",
    answer:
      "UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and dot.case.",
  },
  {
    question: "How does camelCase differ from PascalCase?",
    answer:
      "camelCase starts with a lowercase letter (helloWorld). PascalCase starts with uppercase (HelloWorld). Both remove spaces and capitalise the start of each subsequent word.",
  },
  {
    question: "Does it handle numbers in the text?",
    answer: "Yes. Numbers are preserved as-is in all conversion modes.",
  },
  {
    question: "Is there a character limit?",
    answer:
      "No hard limit — it runs entirely in your browser so performance depends on your device.",
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
      <CaseConverter />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
