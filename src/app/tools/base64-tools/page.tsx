import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { Base64Tools } from "@/components/tool/base64-tools/base64-tools";

const SLUG = "base64-tools";

const faqs: Faq[] = [
  {
    question: "What is Base64?",
    answer:
      "Base64 is an encoding scheme that represents binary data using 64 printable ASCII characters (A–Z, a–z, 0–9, + and /). It is commonly used to embed binary data in JSON, HTML, CSS, and email bodies.",
  },
  {
    question: "What is URL-safe Base64?",
    answer:
      "Standard Base64 uses + and / which have special meaning in URLs. URL-safe Base64 (RFC 4648 §5) replaces them with - and _ and removes the = padding, making the output safe to include in a URL without percent-encoding.",
  },
  {
    question: "Does Base64 compress data?",
    answer:
      "No — it expands it. A Base64 string is roughly 33% larger than the original binary. It is an encoding for safe transmission, not compression.",
  },
  {
    question: "Is encoding done on the server?",
    answer:
      "No. Encoding and decoding happen entirely in your browser using the built-in TextEncoder and atob/btoa APIs. Your data never leaves your device.",
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
      <Base64Tools />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
