import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import type { ValidationStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  ValidationStatus,
  { icon: LucideIcon; className: string }
> = {
  error: { icon: XCircle, className: "text-destructive" },
  success: {
    icon: CheckCircle2,
    className: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    icon: AlertTriangle,
    className: "text-amber-600 dark:text-amber-400",
  },
  info: { icon: Info, className: "text-muted-foreground" },
};

/**
 * Inline status message used across tools for validation feedback (errors,
 * success confirmations, warnings, hints). Color is paired with an icon so it
 * never relies on color alone (WCAG). Errors announce via `role="alert"`.
 */
export function ValidationMessage({
  status = "info",
  children,
  className,
}: {
  status?: ValidationStatus;
  children: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, className: tone } = STATUS_CONFIG[status];
  return (
    <p
      role={status === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-1.5 text-sm", tone, className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
