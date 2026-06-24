import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { ColorPicker } from "@/components/tool/color-picker/color-picker";
const SLUG = "color-picker";
const faqs: Faq[] = [
  {
    question: "What color formats does this tool support?",
    answer:
      "HEX, RGB, RGBA (with opacity), HSL, HSV, and CMYK. Copy any format with one click.",
  },
  {
    question: "What is the contrast ratio checker?",
    answer:
      "It calculates the WCAG contrast ratio between your chosen color and white or black, then shows whether it passes AA or AAA accessibility standards for text.",
  },
  {
    question: "Is my color data saved anywhere?",
    answer:
      "No. Everything runs in your browser. No data is transmitted or stored on a server.",
  },
  {
    question: "What are the tints shown at the bottom?",
    answer:
      "Six lightness steps generated from your color's hue and saturation — useful for building a consistent palette.",
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
      <ColorPicker />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
