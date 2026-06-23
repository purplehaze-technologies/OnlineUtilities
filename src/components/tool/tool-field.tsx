import { Label } from "@/components/ui/label";
import { ValidationMessage } from "@/components/shared/validation-message";
import { cn } from "@/lib/utils";

/**
 * Labelled form field used by every tool control: pairs a `<Label>` with its
 * control, an optional description, an optional right-aligned label addon (e.g.
 * the live value next to a slider), and inline error/hint text.
 *
 * Pass the control as `children` and give it `id={htmlFor}` so the label,
 * description and error are correctly associated for assistive tech.
 */
export function ToolField({
  label,
  htmlFor,
  description,
  error,
  hint,
  required,
  labelAddon,
  orientation = "vertical",
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  description?: string;
  /** Error message — renders below the control with an alert role. */
  error?: string;
  /** Neutral helper text shown when there is no error. */
  hint?: string;
  required?: boolean;
  /** Right-aligned content next to the label (units, current value, …). */
  labelAddon?: React.ReactNode;
  /** "horizontal" puts the control to the right of the label (toggles). */
  orientation?: "vertical" | "horizontal";
  children: React.ReactNode;
  className?: string;
}) {
  const describedBy =
    description && htmlFor ? `${htmlFor}-description` : undefined;

  const labelRow = (
    <div className="flex items-center justify-between gap-2">
      <Label htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="text-destructive ml-0.5" aria-hidden>
            *
          </span>
        ) : null}
      </Label>
      {labelAddon ? (
        <span className="text-muted-foreground text-sm tabular-nums">
          {labelAddon}
        </span>
      ) : null}
    </div>
  );

  if (orientation === "horizontal") {
    return (
      <div className={cn("flex items-center justify-between gap-4", className)}>
        <div className="min-w-0 space-y-0.5">
          <Label htmlFor={htmlFor}>{label}</Label>
          {description ? (
            <p id={describedBy} className="text-muted-foreground text-sm">
              {description}
            </p>
          ) : null}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {labelRow}
      {description ? (
        <p id={describedBy} className="text-muted-foreground text-sm">
          {description}
        </p>
      ) : null}
      {children}
      {error ? (
        <ValidationMessage status="error">{error}</ValidationMessage>
      ) : hint ? (
        <p className="text-muted-foreground text-xs">{hint}</p>
      ) : null}
    </div>
  );
}
