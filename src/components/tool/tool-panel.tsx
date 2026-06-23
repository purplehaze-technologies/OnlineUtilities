import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

/**
 * A titled card section — the standard grouping container for tool controls and
 * results. Header (title, optional description, icon and a right-aligned action
 * slot) are all optional, so it works as a plain framed surface too.
 */
export function ToolPanel({
  title,
  description,
  icon,
  action,
  children,
  className,
  contentClassName,
}: {
  title?: string;
  description?: string;
  /** Icon registry key shown beside the title. */
  icon?: string;
  /** Right-aligned slot in the header (e.g. a reset button or badge). */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const hasHeader = Boolean(title || description || action);
  return (
    <Card className={className}>
      {hasHeader ? (
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div className="min-w-0 space-y-1.5">
            {title ? (
              <CardTitle className="flex items-center gap-2">
                {icon ? (
                  <Icon name={icon} className="text-muted-foreground size-4" />
                ) : null}
                <span>{title}</span>
              </CardTitle>
            ) : null}
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </CardHeader>
      ) : null}
      <CardContent
        className={cn(!hasHeader && "pt-6", "space-y-4", contentClassName)}
      >
        {children}
      </CardContent>
    </Card>
  );
}
