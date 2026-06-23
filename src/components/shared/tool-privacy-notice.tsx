import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { PRIVACY_NOTICE } from "@/lib/constants/tool";

/**
 * Privacy reassurance banner shown on tools that process data entirely in the
 * browser. Reused by every client-side utility to reinforce the core selling
 * point and to keep the message consistent.
 */
export function ToolPrivacyNotice({
  message = PRIVACY_NOTICE,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-muted/40 text-muted-foreground flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm",
        className
      )}
    >
      <ShieldCheck
        className="text-primary mt-0.5 size-4 shrink-0"
        aria-hidden
      />
      <p>{message}</p>
    </div>
  );
}
