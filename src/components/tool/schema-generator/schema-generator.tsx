"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ToolWorkbench } from "@/components/tool/tool-workbench";
import { ToolPanel } from "@/components/tool/tool-panel";
import { ToolField } from "@/components/tool/tool-field";
import { ToolActionBar } from "@/components/tool/tool-action-bar";
import { CopyButton } from "@/components/tool/copy-button";
import { DownloadButton } from "@/components/tool/download-button";
import { CodeDisplay } from "@/components/tool/code-display";
import { ToolPrivacyNotice } from "@/components/shared/tool-privacy-notice";
import { downloadText, generateFileName } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Schema types and builders                                                   */
/* -------------------------------------------------------------------------- */

const SCHEMA_TYPES = [
  "FAQ",
  "Organization",
  "Website",
  "Article",
  "Person",
  "LocalBusiness",
  "BreadcrumbList",
  "Product",
] as const;

type SchemaType = (typeof SCHEMA_TYPES)[number];

interface FaqItem {
  question: string;
  answer: string;
}

interface SchemaState {
  type: SchemaType;
  // shared
  name: string;
  url: string;
  description: string;
  image: string;
  // Organization
  phone: string;
  email: string;
  logo: string;
  // Article
  headline: string;
  authorName: string;
  datePublished: string;
  // LocalBusiness
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  // Product
  price: string;
  currency: string;
  availability: string;
  brand: string;
  // Person
  jobTitle: string;
  // FAQ
  faqs: FaqItem[];
  // BreadcrumbList
  breadcrumbs: Array<{ name: string; url: string }>;
}

const DEFAULTS: SchemaState = {
  type: "FAQ",
  name: "",
  url: "",
  description: "",
  image: "",
  phone: "",
  email: "",
  logo: "",
  headline: "",
  authorName: "",
  datePublished: new Date().toISOString().split("T")[0],
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "IN",
  price: "",
  currency: "INR",
  availability: "InStock",
  brand: "",
  jobTitle: "",
  faqs: [{ question: "", answer: "" }],
  breadcrumbs: [
    { name: "Home", url: "" },
    { name: "", url: "" },
  ],
};

function buildSchema(s: SchemaState): Record<string, unknown> {
  const ctx = "https://schema.org";
  switch (s.type) {
    case "FAQ":
      return {
        "@context": ctx,
        "@type": "FAQPage",
        mainEntity: s.faqs
          .filter((f) => f.question && f.answer)
          .map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
      };
    case "Organization":
      return {
        "@context": ctx,
        "@type": "Organization",
        name: s.name,
        url: s.url,
        description: s.description,
        logo: s.logo ? { "@type": "ImageObject", url: s.logo } : undefined,
        contactPoint: s.phone
          ? {
              "@type": "ContactPoint",
              telephone: s.phone,
              contactType: "customer service",
            }
          : undefined,
        email: s.email || undefined,
      };
    case "Website":
      return {
        "@context": ctx,
        "@type": "WebSite",
        name: s.name,
        url: s.url,
        description: s.description || undefined,
        potentialAction: s.url
          ? {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${s.url}?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            }
          : undefined,
      };
    case "Article":
      return {
        "@context": ctx,
        "@type": "Article",
        headline: s.headline || s.name,
        name: s.name,
        url: s.url,
        description: s.description || undefined,
        image: s.image ? [s.image] : undefined,
        author: s.authorName
          ? { "@type": "Person", name: s.authorName }
          : undefined,
        datePublished: s.datePublished || undefined,
        publisher: s.name
          ? { "@type": "Organization", name: s.name }
          : undefined,
      };
    case "Person":
      return {
        "@context": ctx,
        "@type": "Person",
        name: s.name,
        url: s.url || undefined,
        description: s.description || undefined,
        jobTitle: s.jobTitle || undefined,
        image: s.image || undefined,
        email: s.email || undefined,
      };
    case "LocalBusiness":
      return {
        "@context": ctx,
        "@type": "LocalBusiness",
        name: s.name,
        url: s.url || undefined,
        description: s.description || undefined,
        telephone: s.phone || undefined,
        email: s.email || undefined,
        address: s.streetAddress
          ? {
              "@type": "PostalAddress",
              streetAddress: s.streetAddress,
              addressLocality: s.city,
              postalCode: s.postalCode,
              addressCountry: s.country,
            }
          : undefined,
      };
    case "BreadcrumbList":
      return {
        "@context": ctx,
        "@type": "BreadcrumbList",
        itemListElement: s.breadcrumbs
          .filter((b) => b.name)
          .map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: b.name,
            item: b.url || undefined,
          })),
      };
    case "Product":
      return {
        "@context": ctx,
        "@type": "Product",
        name: s.name,
        description: s.description || undefined,
        image: s.image || undefined,
        brand: s.brand ? { "@type": "Brand", name: s.brand } : undefined,
        offers: {
          "@type": "Offer",
          price: s.price,
          priceCurrency: s.currency,
          availability: `https://schema.org/${s.availability}`,
        },
      };
  }
}

/* -------------------------------------------------------------------------- */
/* Schema-specific form sections                                               */
/* -------------------------------------------------------------------------- */

function SharedFields({ s, set }: { s: SchemaState; set: SetFn }) {
  return (
    <>
      <ToolField label="Name" htmlFor="sg-name">
        <Input
          id="sg-name"
          placeholder="My Business"
          value={s.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </ToolField>
      <ToolField label="URL" htmlFor="sg-url">
        <Input
          id="sg-url"
          type="url"
          placeholder="https://example.com"
          value={s.url}
          onChange={(e) => set("url", e.target.value)}
        />
      </ToolField>
      <ToolField label="Description" htmlFor="sg-desc">
        <Textarea
          id="sg-desc"
          value={s.description}
          onChange={(e) => set("description", e.target.value)}
          className="min-h-20"
        />
      </ToolField>
    </>
  );
}

type SetFn = (k: keyof SchemaState, v: SchemaState[keyof SchemaState]) => void;

function FaqForm({ s, set }: { s: SchemaState; set: SetFn }) {
  const faqs = s.faqs;
  function update(i: number, field: keyof FaqItem, val: string) {
    const updated = faqs.map((f, idx) =>
      idx === i ? { ...f, [field]: val } : f
    );
    set("faqs", updated);
  }
  function addFaq() {
    set("faqs", [...faqs, { question: "", answer: "" }]);
  }
  function removeFaq(i: number) {
    set(
      "faqs",
      faqs.filter((_, idx) => idx !== i)
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="space-y-2 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-semibold">
              Q&amp;A {i + 1}
            </span>
            {faqs.length > 1 && (
              <button
                type="button"
                onClick={() => removeFaq(i)}
                className="text-muted-foreground hover:text-destructive text-xs"
              >
                Remove
              </button>
            )}
          </div>
          <ToolField label="Question" htmlFor={`sg-faq-q-${i}`}>
            <Input
              id={`sg-faq-q-${i}`}
              value={faq.question}
              onChange={(e) => update(i, "question", e.target.value)}
              placeholder="What is your return policy?"
            />
          </ToolField>
          <ToolField label="Answer" htmlFor={`sg-faq-a-${i}`}>
            <Textarea
              id={`sg-faq-a-${i}`}
              value={faq.answer}
              onChange={(e) => update(i, "answer", e.target.value)}
              className="min-h-16"
              placeholder="We offer a 30-day return policy…"
            />
          </ToolField>
        </div>
      ))}
      <button
        type="button"
        onClick={addFaq}
        className="text-primary text-sm hover:underline"
      >
        + Add question
      </button>
    </div>
  );
}

function BreadcrumbForm({ s, set }: { s: SchemaState; set: SetFn }) {
  const crumbs = s.breadcrumbs;
  function update(i: number, field: "name" | "url", val: string) {
    set(
      "breadcrumbs",
      crumbs.map((c, idx) => (idx === i ? { ...c, [field]: val } : c))
    );
  }
  function add() {
    set("breadcrumbs", [...crumbs, { name: "", url: "" }]);
  }
  function remove(i: number) {
    set(
      "breadcrumbs",
      crumbs.filter((_, idx) => idx !== i)
    );
  }

  return (
    <div className="space-y-2">
      {crumbs.map((c, i) => (
        <div key={i} className="flex gap-2">
          <Input
            placeholder="Name"
            value={c.name}
            onChange={(e) => update(i, "name", e.target.value)}
          />
          <Input
            placeholder="URL (optional)"
            value={c.url}
            onChange={(e) => update(i, "url", e.target.value)}
          />
          {crumbs.length > 2 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-muted-foreground hover:text-destructive shrink-0 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-primary text-sm hover:underline"
      >
        + Add item
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */

export function SchemaGenerator() {
  const [state, setState] = React.useState<SchemaState>(DEFAULTS);

  const set: SetFn = (k, v) => setState((prev) => ({ ...prev, [k]: v }));

  const schema = React.useMemo(() => buildSchema(state), [state]);
  const json = React.useMemo(() => JSON.stringify(schema, null, 2), [schema]);
  const scriptTag = `<script type="application/ld+json">\n${json}\n</script>`;

  return (
    <div className="space-y-6">
      <ToolWorkbench
        layout="split"
        stickyOutput={false}
        controls={
          <ToolPanel title="Schema Settings">
            <ToolField label="Schema type" htmlFor="sg-type">
              <Select
                id="sg-type"
                value={state.type}
                onChange={(e) =>
                  setState({ ...DEFAULTS, type: e.target.value as SchemaType })
                }
              >
                {SCHEMA_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </ToolField>

            {state.type === "FAQ" && <FaqForm s={state} set={set} />}

            {state.type === "BreadcrumbList" && (
              <BreadcrumbForm s={state} set={set} />
            )}

            {(
              [
                "Organization",
                "Website",
                "Article",
                "Person",
                "LocalBusiness",
                "Product",
              ] as SchemaType[]
            ).includes(state.type) && <SharedFields s={state} set={set} />}

            {state.type === "Organization" && (
              <>
                <ToolField label="Logo URL" htmlFor="sg-logo">
                  <Input
                    id="sg-logo"
                    type="url"
                    value={state.logo}
                    onChange={(e) => set("logo", e.target.value)}
                  />
                </ToolField>
                <ToolField label="Phone" htmlFor="sg-phone">
                  <Input
                    id="sg-phone"
                    type="tel"
                    value={state.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </ToolField>
                <ToolField label="Email" htmlFor="sg-email">
                  <Input
                    id="sg-email"
                    type="email"
                    value={state.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </ToolField>
              </>
            )}

            {state.type === "Article" && (
              <>
                <ToolField label="Headline" htmlFor="sg-headline">
                  <Input
                    id="sg-headline"
                    value={state.headline}
                    onChange={(e) => set("headline", e.target.value)}
                  />
                </ToolField>
                <ToolField label="Author name" htmlFor="sg-author">
                  <Input
                    id="sg-author"
                    value={state.authorName}
                    onChange={(e) => set("authorName", e.target.value)}
                  />
                </ToolField>
                <ToolField label="Date published" htmlFor="sg-date">
                  <Input
                    id="sg-date"
                    type="date"
                    value={state.datePublished}
                    onChange={(e) => set("datePublished", e.target.value)}
                  />
                </ToolField>
                <ToolField label="Image URL" htmlFor="sg-img">
                  <Input
                    id="sg-img"
                    type="url"
                    value={state.image}
                    onChange={(e) => set("image", e.target.value)}
                  />
                </ToolField>
              </>
            )}

            {state.type === "Person" && (
              <>
                <ToolField label="Job title" htmlFor="sg-jobtitle">
                  <Input
                    id="sg-jobtitle"
                    value={state.jobTitle}
                    onChange={(e) => set("jobTitle", e.target.value)}
                  />
                </ToolField>
                <ToolField label="Email" htmlFor="sg-p-email">
                  <Input
                    id="sg-p-email"
                    type="email"
                    value={state.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </ToolField>
              </>
            )}

            {state.type === "LocalBusiness" && (
              <>
                <ToolField label="Phone" htmlFor="sg-lb-phone">
                  <Input
                    id="sg-lb-phone"
                    type="tel"
                    value={state.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </ToolField>
                <ToolField label="Street address" htmlFor="sg-street">
                  <Input
                    id="sg-street"
                    value={state.streetAddress}
                    onChange={(e) => set("streetAddress", e.target.value)}
                  />
                </ToolField>
                <div className="grid grid-cols-2 gap-2">
                  <ToolField label="City" htmlFor="sg-city">
                    <Input
                      id="sg-city"
                      value={state.city}
                      onChange={(e) => set("city", e.target.value)}
                    />
                  </ToolField>
                  <ToolField label="Postal code" htmlFor="sg-postal">
                    <Input
                      id="sg-postal"
                      value={state.postalCode}
                      onChange={(e) => set("postalCode", e.target.value)}
                    />
                  </ToolField>
                </div>
              </>
            )}

            {state.type === "Product" && (
              <>
                <ToolField label="Brand" htmlFor="sg-brand">
                  <Input
                    id="sg-brand"
                    value={state.brand}
                    onChange={(e) => set("brand", e.target.value)}
                  />
                </ToolField>
                <ToolField label="Image URL" htmlFor="sg-prod-img">
                  <Input
                    id="sg-prod-img"
                    type="url"
                    value={state.image}
                    onChange={(e) => set("image", e.target.value)}
                  />
                </ToolField>
                <div className="grid grid-cols-2 gap-2">
                  <ToolField label="Price" htmlFor="sg-price">
                    <Input
                      id="sg-price"
                      type="number"
                      value={state.price}
                      onChange={(e) => set("price", e.target.value)}
                    />
                  </ToolField>
                  <ToolField label="Currency" htmlFor="sg-currency">
                    <Select
                      id="sg-currency"
                      value={state.currency}
                      onChange={(e) => set("currency", e.target.value)}
                    >
                      <option>INR</option>
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </Select>
                  </ToolField>
                </div>
                <ToolField label="Availability" htmlFor="sg-avail">
                  <Select
                    id="sg-avail"
                    value={state.availability}
                    onChange={(e) => set("availability", e.target.value)}
                  >
                    <option>InStock</option>
                    <option>OutOfStock</option>
                    <option>PreOrder</option>
                  </Select>
                </ToolField>
              </>
            )}
          </ToolPanel>
        }
        output={
          <div className="space-y-4">
            <ToolPanel
              title="JSON-LD"
              description="Paste this <script> tag in your page's <head>."
            >
              <CodeDisplay code={scriptTag} language="text" maxHeight={500} />
              <ToolActionBar>
                <CopyButton value={scriptTag} label="Copy script tag" />
                <CopyButton value={json} label="Copy JSON" variant="outline" />
                <DownloadButton
                  onDownload={() =>
                    downloadText(
                      scriptTag,
                      generateFileName("schema", "html"),
                      "text/html"
                    )
                  }
                  label="Download"
                  variant="outline"
                />
              </ToolActionBar>
            </ToolPanel>
          </div>
        }
      />
      <ToolPrivacyNotice />
    </div>
  );
}
