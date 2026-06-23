import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Styled native range input. Native keeps it keyboard-accessible and dependency
 * free; tools use it for numeric ranges (QR size, password length, quality).
 */
function Slider({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="range"
      className={cn(
        "accent-primary h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--muted)]",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Slider };
