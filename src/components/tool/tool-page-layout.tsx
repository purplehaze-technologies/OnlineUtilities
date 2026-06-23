import type { Tool } from "@/types";
import { getCategory } from "@/lib/data/categories";
import { webApplicationJsonLd } from "@/lib/seo/jsonld";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/shared/json-ld";
import { Icon } from "@/components/shared/icon";
import { Badge } from "@/components/ui/badge";
import { RelatedTools } from "@/components/tool/related-tools";

/**
 * Shared shell for every tool route. A new tool page only needs to render
 * <ToolPageLayout tool={tool}>{ui}</ToolPageLayout>, keeping pages tiny and
 * consistent (breadcrumb, header, related tools and JSON-LD come for free).
 */
export function ToolPageLayout({
  tool,
  children,
}: {
  tool: Tool;
  children: React.ReactNode;
}) {
  const category = getCategory(tool.category);
  const path = `/tools/${tool.slug}`;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Breadcrumb
        items={[
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: tool.name, path },
        ]}
      />

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-xl">
          <Icon name={tool.icon} className="size-7" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {tool.name}
            </h1>
            {category ? (
              <Badge variant="secondary">{category.name}</Badge>
            ) : null}
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {tool.longDescription ?? tool.description}
          </p>
        </div>
      </header>

      <div className="mt-8">{children}</div>

      <RelatedTools tool={tool} />

      <JsonLd
        data={webApplicationJsonLd({
          name: tool.name,
          description: tool.description,
          path,
          category: category?.name ?? "Utility",
        })}
      />
    </div>
  );
}
