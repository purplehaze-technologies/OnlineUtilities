import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { MetaTagGenerator } from "@/components/tool/meta-tag-generator/meta-tag-generator";
const SLUG = "meta-tag-generator";
const faqs: Faq[] = [
  {
    question: "What is the recommended title length?",
    answer:
      "30-60 characters. Google typically shows up to ~60 characters before truncating in search results.",
  },
  {
    question: "What is the recommended meta description length?",
    answer:
      "120-160 characters. Longer descriptions may be cut off in search snippets.",
  },
  {
    question: "Are keywords meta tags still important for SEO?",
    answer:
      "Major search engines like Google have ignored the keywords meta tag since around 2009. It does not hurt to include them but it will not improve rankings.",
  },
  {
    question: "What is the Open Graph protocol?",
    answer:
      "A set of meta tags that control how your page appears when shared on social media platforms like Facebook, LinkedIn, and WhatsApp.",
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
      <MetaTagGenerator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
