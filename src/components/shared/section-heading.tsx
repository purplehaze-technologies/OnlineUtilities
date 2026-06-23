import { cn } from "@/lib/utils";

/** Consistent section title + optional eyebrow/description across pages. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground mt-3">{description}</p>
      ) : null}
    </div>
  );
}
