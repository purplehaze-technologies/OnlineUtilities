import type { Tool } from "@/types";
import { getRelatedTools } from "@/lib/data/tools";
import { ToolCard } from "@/components/tool/tool-card";

/** Shows other tools in the same category as the current tool. */
export function RelatedTools({ tool }: { tool: Tool }) {
  const related = getRelatedTools(tool);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-tools" className="mt-16">
      <h2 id="related-tools" className="text-xl font-semibold tracking-tight">
        Related tools
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
    </section>
  );
}
