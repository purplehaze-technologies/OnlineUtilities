import { SearchX } from "lucide-react";

import type { IconComponent } from "@/types";
import { cn } from "@/lib/utils";

/** Reusable empty state for search results, empty lists, etc. */
export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className,
}: {
  icon?: IconComponent;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-muted/20 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center",
        className
      )}
    >
      <span className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description ? (
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
