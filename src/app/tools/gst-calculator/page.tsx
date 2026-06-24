import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { GstCalculator } from "@/components/tool/gst-calculator/gst-calculator";
const SLUG = "gst-calculator";
const faqs: Faq[] = [
  {
    question: "What is GST exclusive vs inclusive?",
    answer:
      "Exclusive means GST is added on top of the base amount. Inclusive means the amount already contains GST and you need to back-calculate the base and tax portions.",
  },
  {
    question: "Which GST rates are supported?",
    answer:
      "Standard Indian GST slabs: 3%, 5%, 12%, 18%, 28%, plus a custom rate field.",
  },
  {
    question: "Is this for Indian GST only?",
    answer:
      "The calculation is mathematically identical to any VAT or sales tax system, so it works for any tax-inclusive/exclusive split regardless of country.",
  },
  {
    question: "Are the results accurate?",
    answer:
      "The calculation uses standard arithmetic. For financial or legal purposes always verify with a qualified accountant or the official GST portal.",
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
      <GstCalculator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
