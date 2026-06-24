import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { EmiCalculator } from "@/components/tool/emi-calculator/emi-calculator";
const SLUG = "emi-calculator";
const faqs: Faq[] = [
  {
    question: "What is EMI?",
    answer:
      "An Equated Monthly Instalment (EMI) is the fixed monthly amount paid to repay a loan. It consists of both principal repayment and interest components.",
  },
  {
    question: "What EMI formula is used?",
    answer:
      "E = P x r x (1+r)^n / ((1+r)^n - 1), where P is the principal, r is the monthly interest rate (annual/12/100), and n is the loan tenure in months.",
  },
  {
    question: "Why does interest dominate early EMIs?",
    answer:
      "In early months the outstanding principal is high, so more of each EMI goes toward interest. As the principal reduces, the interest portion decreases.",
  },
  {
    question: "Can I use this for home loans, car loans, and personal loans?",
    answer:
      "Yes. The EMI formula is identical for all loan types — just enter the correct principal, interest rate, and tenure.",
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
      <EmiCalculator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
