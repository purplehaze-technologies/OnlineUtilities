import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { ImageToBase64 } from "@/components/tool/image-to-base64/image-to-base64";

const SLUG = "image-to-base64";

const faqs: Faq[] = [
  {
    question: "What is a data URL?",
    answer:
      "A data URL (data URI) embeds the file content directly in the URL string using Base64 encoding, prefixed with the MIME type. For example: data:image/png;base64,iVBORw0K…  You can use it as the src of an img tag or a CSS background-image.",
  },
  {
    question: "When should I use raw Base64 vs a data URL?",
    answer:
      "Use a data URL when you want a complete, self-contained src value. Use raw Base64 when your framework or API constructs the prefix separately (e.g. attaching an image to an email).",
  },
  {
    question: "Why is the encoded output larger than the original?",
    answer:
      "Base64 encoding expands binary data by approximately 33% because it represents every 3 bytes as 4 ASCII characters.",
  },
  {
    question: "Is my image uploaded anywhere?",
    answer:
      "No. The image is read and converted using the browser's FileReader API. It never leaves your device.",
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
      <ImageToBase64 />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
