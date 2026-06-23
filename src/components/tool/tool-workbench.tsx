import { cn } from "@/lib/utils";

/**
 * Two-column "workbench" layout that nearly every interactive tool shares:
 * controls/input on one side, output/preview on the other. Stacks to a single
 * column on small screens.
 *
 * - `layout="split"` (default) → equal columns (JSON formatter, Base64,
 *   Markdown previewer, Case converter).
 * - `layout="sidebar"` → wider controls + a narrower, sticky output column
 *   (QR/Barcode generator, Password generator, Color picker).
 */
export function ToolWorkbench({
  controls,
  output,
  layout = "split",
  stickyOutput = true,
  className,
}: {
  controls: React.ReactNode;
  output: React.ReactNode;
  layout?: "split" | "sidebar";
  stickyOutput?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        layout === "sidebar"
          ? "lg:grid-cols-[minmax(0,1fr)_360px]"
          : "lg:grid-cols-2",
        className
      )}
    >
      <div className="min-w-0">{controls}</div>
      <div className="min-w-0">
        <div className={cn(stickyOutput && "lg:sticky lg:top-24")}>
          {output}
        </div>
      </div>
    </div>
  );
}
