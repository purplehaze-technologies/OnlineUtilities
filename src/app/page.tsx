import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  Gift,
  Lock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";

import { tools, getFeaturedTools, getPopularTools } from "@/lib/data/tools";
import { categories } from "@/lib/data/categories";
import { homeFaqs } from "@/lib/data/faqs";
import { siteConfig } from "@/lib/constants/site";
import { createMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolCard } from "@/components/tool/tool-card";
import { CategoryCard } from "@/components/tool/category-card";
import { ToolSearch } from "@/components/tool/tool-search";
import { SectionHeading } from "@/components/shared/section-heading";
import { FaqSection } from "@/components/shared/faq-section";

export const metadata = createMetadata({ path: "/" });

const benefits = [
  {
    icon: Zap,
    title: "Blazing fast",
    description:
      "Tools run instantly in your browser with no waiting and no page reloads.",
  },
  {
    icon: Lock,
    title: "Privacy first",
    description:
      "Your data stays on your device. We don't store what you enter.",
  },
  {
    icon: Gift,
    title: "Always free",
    description:
      "Every tool is free forever — no sign-up, no paywalls, no ads.",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    description:
      "Mobile-first and fully responsive on phones, tablets and desktops.",
  },
  {
    icon: ShieldCheck,
    title: "Accessible",
    description:
      "Built to WCAG AA with full keyboard support and semantic markup.",
  },
  {
    icon: Gauge,
    title: "Built to scale",
    description:
      "A growing collection engineered to reach hundreds of quality tools.",
  },
];

export default function HomePage() {
  const featured = getFeaturedTools();
  const popular = getPopularTools(8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--primary),transparent)] opacity-[0.10]" />
        <div className="container mx-auto px-4 py-20 text-center md:py-28">
          <Badge variant="default" className="mx-auto">
            <Sparkles className="size-3.5" />
            {tools.length}+ free tools and growing
          </Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Free online tools for everything you do
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg text-balance">
            {siteConfig.name} is a fast, modern suite of utilities — generators,
            formatters, converters and calculators. No sign-up. No limits.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/tools">
                Explore all tools
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#search">Search tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search */}
      <section
        id="search"
        className="container mx-auto scroll-mt-20 px-4 py-16"
      >
        <SectionHeading
          eyebrow="Find a tool"
          title="Search the entire toolbox"
          description="Filter by name, description or category. Results update as you type."
        />
        <div className="mx-auto mt-8 max-w-5xl">
          <ToolSearch tools={tools} />
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Hand-picked"
          title="Featured tools"
          description="The utilities people reach for the most."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Browse"
            title="Explore by category"
            description="Every tool, neatly organized so you can find what you need fast."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Trending"
          title="Popular utilities"
          description="A quick look at some of the most-used tools on the platform."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Why choose */}
      <section className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-16">
          <SectionHeading
            eyebrow="Why OnlineUtilities"
            title="Built for speed, privacy and simplicity"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <FaqSection faqs={homeFaqs} />
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl border px-6 py-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">
            Ready to get things done?
          </h2>
          <p className="text-primary-foreground/80 mx-auto mt-3 max-w-xl text-balance">
            Jump into the full collection of free tools — no account required.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-7">
            <Link href="/tools">
              Browse all tools
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
