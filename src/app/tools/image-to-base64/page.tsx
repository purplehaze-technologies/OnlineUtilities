import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { ComingSoon } from "@/components/tool/coming-soon";

const SLUG = "image-to-base64";

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
      <ComingSoon toolName={tool.name} />
    </ToolPageLayout>
  );
}
