import type { Faq } from "@/lib/data/faqs";
import { faqJsonLd } from "@/lib/seo/jsonld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/shared/json-ld";

/** Reusable FAQ block that also emits FAQPage JSON-LD for rich results. */
export function FaqSection({
  faqs,
  heading = "Frequently asked questions",
  withJsonLd = true,
}: {
  faqs: Faq[];
  heading?: string;
  withJsonLd?: boolean;
}) {
  return (
    <section aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-center text-2xl font-bold tracking-tight md:text-3xl"
      >
        {heading}
      </h2>
      <div className="mx-auto mt-8 max-w-2xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      {withJsonLd ? <JsonLd data={faqJsonLd(faqs)} /> : null}
    </section>
  );
}
