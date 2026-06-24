import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { PasswordGenerator } from "@/components/tool/password-generator/password-generator";

const SLUG = "password-generator";

const faqs: Faq[] = [
  {
    question: "How are the passwords generated?",
    answer:
      "Passwords are generated using the browser's Web Crypto API (crypto.getRandomValues), which produces cryptographically strong random values — not the weaker Math.random().",
  },
  {
    question: "What does entropy mean?",
    answer:
      "Entropy measures the unpredictability of a password in bits. Each extra bit doubles the number of possible passwords an attacker must try. A 60-bit password offers around a trillion trillion combinations.",
  },
  {
    question: "Are my passwords stored or sent anywhere?",
    answer:
      "No. Generation is entirely client-side. The passwords exist only in your browser and are gone when you close the tab.",
  },
  {
    question: "Why exclude similar characters?",
    answer:
      "Characters like i, l, 1, L, o, 0, O look alike in many fonts. Excluding them makes passwords easier to read and type from a printed copy without making mistakes.",
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
      <PasswordGenerator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
