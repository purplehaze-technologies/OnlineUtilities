import { cn } from "@/lib/utils";

/**
 * A horizontal, wrapping row that groups a tool's result actions (copy,
 * download, share, reset). Exposed as a `toolbar` for assistive tech.
 */
export function ToolActionBar({
  children,
  label = "Tool actions",
  align = "start",
  className,
}: {
  children: React.ReactNode;
  label?: string;
  align?: "start" | "center" | "end" | "between";
  className?: string;
}) {
  return (
    <div
      role="toolbar"
      aria-label={label}
      className={cn(
        "flex flex-wrap items-center gap-2",
        align === "center" && "justify-center",
        align === "end" && "justify-end",
        align === "between" && "justify-between",
        className
      )}
    >
      {children}
    </div>
  );
}
