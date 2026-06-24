import type { StrengthLevel } from "@/lib/utils/password";
import { cn } from "@/lib/utils";

const COLORS: Record<StrengthLevel, string> = {
  0: "bg-red-500",
  1: "bg-orange-500",
  2: "bg-yellow-500",
  3: "bg-green-500",
  4: "bg-emerald-500",
};

const WIDTH: Record<StrengthLevel, string> = {
  0: "w-1/5",
  1: "w-2/5",
  2: "w-3/5",
  3: "w-4/5",
  4: "w-full",
};

/**
 * Entropy-based password strength bar. Shared by the Password Generator tool;
 * generic enough for any tool that needs a "strength of a value" indicator
 * (e.g. a future API-key generator or hash strength display).
 */
export function StrengthMeter({
  label,
  level,
  entropy,
  crackTime,
  className,
}: {
  label: string;
  level: StrengthLevel;
  entropy: number;
  crackTime: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Strength</span>
        <span className="font-medium">{label}</span>
      </div>
      <div
        className="bg-muted h-2 w-full overflow-hidden rounded-full"
        role="meter"
        aria-label="Password strength"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={4}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            COLORS[level],
            WIDTH[level]
          )}
        />
      </div>
      <p className="text-muted-foreground text-xs">
        {entropy} bits entropy · estimated crack time: {crackTime}
      </p>
    </div>
  );
}
