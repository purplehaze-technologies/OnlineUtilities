import type { StatItem } from "@/types";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

/**
 * Compact grid of labelled statistics — words/characters, byte size, line
 * counts, entropy, etc. Reused by any tool that reports metrics about its
 * input or output (Word counter, JSON formatter, Base64, Password generator).
 */
export function ToolStats({
  stats,
  columns = 4,
  className,
}: {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  if (stats.length === 0) return null;

  return (
    <dl
      className={cn(
        "grid gap-3",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-2 sm:grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-4",
        className
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-muted/30 flex flex-col gap-1 rounded-lg border p-3"
        >
          <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            {stat.icon ? <Icon name={stat.icon} className="size-3.5" /> : null}
            {stat.label}
          </dt>
          <dd className="text-lg font-semibold tabular-nums">{stat.value}</dd>
          {stat.hint ? (
            <p className="text-muted-foreground text-xs">{stat.hint}</p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
