import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import type { Faq } from "@/lib/data/faqs";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { FaqSection } from "@/components/shared/faq-section";
import { JwtDecoder } from "@/components/tool/jwt-decoder/jwt-decoder";

const SLUG = "jwt-decoder";

const faqs: Faq[] = [
  {
    question: "What is a JWT?",
    answer:
      "A JSON Web Token (JWT) is a compact, URL-safe token consisting of three Base64URL-encoded segments: a header (algorithm and type), a payload (claims), and a signature. They are widely used for authentication and information exchange.",
  },
  {
    question: "Does decoding verify the signature?",
    answer:
      "No — and this is intentional. Signature verification requires the secret key or public key and must happen on a trusted server. Decoding only shows what the token contains, not whether it is authentic.",
  },
  {
    question: "Is my token sent to a server?",
    answer:
      "Absolutely not. The entire decoding process runs in your browser using JavaScript string operations. Your token never leaves your device.",
  },
  {
    question: "What are the standard JWT claims?",
    answer:
      "The registered claims include: sub (subject), iss (issuer), aud (audience), exp (expiration time), iat (issued at), nbf (not before), and jti (JWT ID). Most of these are optional but widely used.",
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
      <JwtDecoder />
      <div className="mt-16">
        <FaqSection faqs={faqs} />
      </div>
    </ToolPageLayout>
  );
}
