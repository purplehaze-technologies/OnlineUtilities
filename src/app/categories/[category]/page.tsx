import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { getToolsByCategory } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ToolCard } from "@/components/tool/tool-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Icon } from "@/components/shared/icon";

type Params = Promise<{ category: string }>;

/** Pre-render every category page at build time. */
export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return createMetadata({ path: `/categories/${slug}` });

  return createMetadata({
    title: category.name,
    description: category.description,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryTools = getToolsByCategory(category.id);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Breadcrumb
        items={[
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: category.name, path: `/categories/${category.slug}` },
        ]}
      />

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-xl">
          <Icon name={category.icon} className="size-7" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {category.name}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {category.description}
          </p>
        </div>
      </header>

      {categoryTools.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tools here yet"
          description="Tools for this category are on the way. Check back soon."
          className="mt-10"
        />
      )}
    </div>
  );
}
