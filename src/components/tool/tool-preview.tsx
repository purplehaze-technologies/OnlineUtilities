import { ImageOff } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

/**
 * Framed display surface for a tool's visual output (QR/barcode image, rendered
 * markdown, color swatch, …). Centers its content, reserves height to avoid
 * layout shift, and renders an `EmptyState` until there's something to show.
 *
 * Set `checkerboard` to reveal transparency behind the result.
 */
export function ToolPreview({
  children,
  isEmpty = false,
  emptyTitle = "Nothing to preview yet",
  emptyDescription = "Your result will appear here.",
  checkerboard = false,
  className,
}: {
  children?: React.ReactNode;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  checkerboard?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "bg-muted/20 flex min-h-64 items-center justify-center rounded-xl border p-6",
        checkerboard && !isEmpty && "tool-preview-checkerboard",
        className
      )}
    >
      {isEmpty ? (
        <EmptyState
          icon={ImageOff}
          title={emptyTitle}
          description={emptyDescription}
          className="border-0 bg-transparent px-0 py-0"
        />
      ) : (
        children
      )}
    </div>
  );
}
