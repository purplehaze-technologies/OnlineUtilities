"use client";

import * as React from "react";
import { Search } from "lucide-react";

import type { Tool } from "@/types";
import { searchTools } from "@/lib/data/tools";
import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/tool/tool-card";
import { EmptyState } from "@/components/shared/empty-state";

/**
 * Instant, client-side tool search. Filtering runs synchronously over the
 * in-memory dataset; `useDeferredValue` keeps typing smooth while the (large)
 * results grid re-renders. No network, no extra dependency.
 */
export function ToolSearch({
  tools,
  autoFocus = false,
  placeholder = "Search tools — try “qr”, “json”, “password”…",
}: {
  tools: Tool[];
  autoFocus?: boolean;
  placeholder?: string;
}) {
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query);

  const results = React.useMemo(() => {
    if (!deferredQuery.trim()) return tools;
    // searchTools queries the full dataset; intersect with the provided list
    // so this component also works for scoped (e.g. category) lists.
    const allowed = new Set(tools.map((t) => t.id));
    return searchTools(deferredQuery).filter((t) => allowed.has(t.id));
  }, [deferredQuery, tools]);

  return (
    <div>
      <div className="relative">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label="Search tools"
          className="h-12 pl-11 text-base"
        />
      </div>

      <p className="text-muted-foreground mt-3 text-sm" aria-live="polite">
        {results.length} {results.length === 1 ? "tool" : "tools"}
        {deferredQuery.trim() ? ` matching “${deferredQuery.trim()}”` : ""}
      </p>

      {results.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tools found"
          description="Try a different keyword — search matches names, descriptions and categories."
          className="mt-6"
        />
      )}
    </div>
  );
}
