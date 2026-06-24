import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { BarcodeGenerator } from "@/components/tool/barcode-generator/barcode-generator";

const SLUG = "barcode-generator";

const faqs: Faq[] = [
  {
    question: "Which barcode format should I use?",
    answer:
      "Code 128 is the most flexible — it encodes any printable ASCII and is used in logistics. EAN-13 and UPC-A are for retail products. EAN-8 for small packaging. ITF-14 for shipping cartons. Code 39 for older industrial systems.",
  },
  {
    question: "Why does my EAN-13 barcode say the input is invalid?",
    answer:
      "EAN-13 requires exactly 12 digits — the 13th (check) digit is calculated automatically. Make sure you are entering 12 digits with no spaces or letters.",
  },
  {
    question: "Can I use these barcodes commercially?",
    answer:
      "The barcodes themselves are standard open formats. For retail use (EAN/UPC), you must obtain a legitimate GS1 company prefix and product number — a barcode generator cannot assign those for you.",
  },
  {
    question: "Is the generation server-side?",
    answer:
      "No. Barcodes are rendered directly in your browser as SVG using the JsBarcode library. Nothing is uploaded to a server.",
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
      <BarcodeGenerator />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
