import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { QrCodeGenerator } from "@/components/tool/qr-code-generator/qr-code-generator";

const SLUG = "qr-code-generator";

const faqs: Faq[] = [
  {
    question: "Is this QR code generator really free?",
    answer:
      "Yes. You can create and download unlimited QR codes for free, with no sign-up, watermark or usage limits.",
  },
  {
    question: "Do my QR codes expire or get tracked?",
    answer:
      "No. The codes are static and encode your content directly, so they never expire and there is no redirect, tracking or analytics in the middle.",
  },
  {
    question: "Is my data uploaded anywhere?",
    answer:
      "No. The QR code is generated entirely in your browser. Whatever you enter — links, Wi-Fi passwords, contact details — never leaves your device.",
  },
  {
    question: "Should I download PNG or SVG?",
    answer:
      "Use PNG for quick sharing and on-screen use. Choose SVG when you need a crisp, infinitely scalable file for print or design work.",
  },
  {
    question: "What is the error correction level?",
    answer:
      "It controls how much of the code can be damaged or covered (for example by a logo) while staying scannable. Higher levels are more resilient but make the pattern denser.",
  },
  {
    question: "How do I make a QR code for my Wi-Fi?",
    answer:
      "Pick the Wi-Fi tab, enter your network name and password, choose the encryption type, then download. Scanning it lets guests join your network without typing the password.",
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
      <QrCodeGenerator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
