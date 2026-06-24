import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { UuidGenerator } from "@/components/tool/uuid-generator/uuid-generator";

const SLUG = "uuid-generator";

const faqs: Faq[] = [
  {
    question: "What is a UUID?",
    answer:
      "A UUID (Universally Unique Identifier) is a 128-bit label used to uniquely identify objects in computer systems without a central authority. They are standardised in RFC 9562.",
  },
  {
    question: "What is the difference between UUID v4 and v7?",
    answer:
      "v4 is entirely random — each UUID is statistically unique with no ordering. v7 embeds a millisecond-precision Unix timestamp in the first 48 bits, so UUIDs generated later sort after earlier ones. v7 is preferred for database primary keys because it avoids index fragmentation.",
  },
  {
    question: "Are these UUIDs safe to use in production?",
    answer:
      "Yes. Generation uses the browser's built-in crypto.randomUUID() (for v4) and crypto.getRandomValues() (for v7), which produce cryptographically strong random values.",
  },
  {
    question: "Is my data sent to a server?",
    answer:
      "No. All UUIDs are generated entirely in your browser using the Web Crypto API. Nothing is transmitted anywhere.",
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
      <UuidGenerator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
