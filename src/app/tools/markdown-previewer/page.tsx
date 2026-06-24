import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { MarkdownPreviewer } from "@/components/tool/markdown-previewer/markdown-previewer";
const SLUG = "markdown-previewer";
const faqs: Faq[] = [
  {
    question: "Which Markdown features are supported?",
    answer:
      "Standard CommonMark: headings, bold, italic, strikethrough, code, blockquotes, lists, tables, horizontal rules, links, and images.",
  },
  {
    question: "Can I export the preview as HTML?",
    answer:
      "Yes. Click Download to save the rendered HTML, or Copy HTML to copy just the markup to your clipboard.",
  },
  {
    question: "Is my Markdown stored anywhere?",
    answer:
      "No. The document lives only in your browser tab. Download or copy before closing.",
  },
  {
    question: "What library is used for Markdown parsing?",
    answer:
      "The marked library, loaded dynamically so it does not add to the initial page weight.",
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
      <MarkdownPreviewer />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
