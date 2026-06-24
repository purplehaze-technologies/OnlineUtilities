import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { SipCalculator } from "@/components/tool/sip-calculator/sip-calculator";
const SLUG = "sip-calculator";
const faqs: Faq[] = [
  {
    question: "What is SIP?",
    answer:
      "A Systematic Investment Plan (SIP) lets you invest a fixed amount in a mutual fund at regular intervals. The calculator shows how wealth grows with monthly compounding.",
  },
  {
    question: "What compounding frequency is used?",
    answer:
      "Monthly compounding. The annual return rate is divided by 12 to get the effective monthly rate.",
  },
  {
    question: "Are these returns guaranteed?",
    answer:
      "No. Mutual fund returns are market-linked and not guaranteed. The expected return is an estimate.",
  },
  {
    question: "What is the SIP formula used?",
    answer:
      "FV = P x ((1+r)^n - 1) / r x (1+r), where P is monthly investment, r is monthly rate (annual/12/100), and n is total months.",
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
      <SipCalculator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
