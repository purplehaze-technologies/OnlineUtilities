import { tools } from "@/lib/data/tools";
import { categories } from "@/lib/data/categories";
import { createMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ToolSearch } from "@/components/tool/tool-search";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = createMetadata({
  title: "All Tools",
  description:
    "Browse the full collection of free online utilities — generators, formatters, converters and calculators. Search by name or category.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Breadcrumb
        items={[
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
        ]}
      />

      <header className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          All Tools
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl">
          Explore every utility on {""}
          OnlineUtilities. Search instantly or jump to a category.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Badge
                variant="secondary"
                className="hover:bg-secondary/70 transition-colors"
              >
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>
      </header>

      <div className="mt-10">
        <ToolSearch tools={tools} />
      </div>
    </div>
  );
}
