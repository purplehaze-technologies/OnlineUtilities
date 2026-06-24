import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { AgeCalculator } from "@/components/tool/age-calculator/age-calculator";
const SLUG = "age-calculator";
const faqs: Faq[] = [
  {
    question: "Does this calculator handle leap years?",
    answer:
      "Yes. The calculation uses JavaScript's built-in Date arithmetic, which correctly handles leap years, varying month lengths, and year boundaries.",
  },
  {
    question: "Can I calculate age at a specific past or future date?",
    answer:
      "Yes. Set the target date to any date — past or future — and the age is calculated relative to that date rather than today.",
  },
  {
    question: "What zodiac sign calculation is used?",
    answer:
      "Western (tropical) astrology signs based on the month and day of the date of birth.",
  },
  {
    question: "Is the birthday countdown exact?",
    answer:
      "The countdown shows the number of calendar days remaining until the next birthday, measured from midnight to midnight.",
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
      <AgeCalculator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
