import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Tool } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/shared/icon";

/**
 * Generic, data-driven tool card used on the homepage, /tools, category and
 * related-tools sections. The entire card is a single link for large tap
 * targets (mobile + a11y friendly).
 */
export function ToolCard({
  tool,
  className,
}: {
  tool: Tool;
  className?: string;
}) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group bg-card relative flex h-full flex-col rounded-xl border p-5 shadow-sm transition-all",
        "hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-11 items-center justify-center rounded-lg transition-colors">
          <Icon name={tool.icon} className="size-5" />
        </span>
        {tool.comingSoon ? (
          <Badge variant="muted">Coming soon</Badge>
        ) : (
          <ArrowRight className="text-muted-foreground group-hover:text-foreground size-5 transition-transform group-hover:translate-x-0.5" />
        )}
      </div>
      <h3 className="font-semibold tracking-tight">{tool.name}</h3>
      <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm">
        {tool.description}
      </p>
    </Link>
  );
}
