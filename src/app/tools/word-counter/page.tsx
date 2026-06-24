import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { WordCounter } from "@/components/tool/word-counter/word-counter";
const SLUG = "word-counter";
const faqs: Faq[] = [
  {
    question: "How is reading time calculated?",
    answer:
      "Based on an average reading speed of 200 words per minute (WPM). Speaking time uses 130 WPM.",
  },
  {
    question: "How are sentences counted?",
    answer:
      "By counting terminal punctuation marks (. ! ?) followed by whitespace or end of text. Abbreviations may occasionally cause over-counting.",
  },
  {
    question: "What is keyword density?",
    answer:
      "The percentage of times a specific word appears relative to total word count. Common stop words are excluded so only meaningful words appear.",
  },
  {
    question: "Is my text uploaded anywhere?",
    answer:
      "No. All analysis happens instantly in your browser using JavaScript. Your text never leaves your device.",
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
      <WordCounter />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
