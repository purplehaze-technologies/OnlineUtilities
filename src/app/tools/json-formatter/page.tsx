import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { JsonFormatter } from "@/components/tool/json-formatter/json-formatter";

const SLUG = "json-formatter";

const faqs: Faq[] = [
  {
    question: "What does beautify do?",
    answer:
      "Beautify (also called pretty-print) parses your JSON and re-serialises it with consistent indentation and line breaks, making nested structures easy to read.",
  },
  {
    question: "What does minify do?",
    answer:
      "Minify strips all whitespace outside of string values, producing the smallest possible JSON string. Useful for reducing payload size in APIs and storage.",
  },
  {
    question: "Does it handle large JSON files?",
    answer:
      "Yes. Processing happens entirely in your browser using the native JSON.parse and JSON.stringify APIs, which are highly optimised. Very large files (tens of MB) may take a moment.",
  },
  {
    question: "Is my JSON sent to a server?",
    answer:
      "No. Everything runs client-side. Your JSON never leaves your browser, making this safe for sensitive configuration files and API responses.",
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
      <JsonFormatter />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
