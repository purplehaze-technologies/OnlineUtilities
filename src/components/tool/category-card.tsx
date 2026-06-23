import Link from "next/link";

import type { Category } from "@/types";
import { getToolCountByCategory } from "@/lib/data/tools";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";

/** Data-driven category tile linking to the category index page. */
export function CategoryCard({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const count = getToolCountByCategory(category.id);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group bg-card flex flex-col items-start rounded-xl border p-5 shadow-sm transition-all",
        "hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
    >
      <span className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-11 items-center justify-center rounded-lg transition-colors">
        <Icon name={category.icon} className="size-5" />
      </span>
      <h3 className="mt-4 font-semibold tracking-tight">{category.name}</h3>
      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
        {category.description}
      </p>
      <span className="text-muted-foreground mt-3 text-xs font-medium">
        {count} {count === 1 ? "tool" : "tools"}
      </span>
    </Link>
  );
}
