import Link from "next/link";
import { Bell, Hammer } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Placeholder body shown for tools that are planned but not yet implemented.
 * Replace this with the real tool UI and set `comingSoon: false` in the data.
 */
export function ComingSoon({ toolName }: { toolName: string }) {
  return (
    <div className="bg-muted/20 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-20 text-center">
      <span className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
        <Hammer className="size-7" aria-hidden />
      </span>
      <h2 className="mt-5 text-xl font-semibold">{toolName} is coming soon</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        We&apos;re building this tool right now. It will be fast, free and
        privacy-friendly — just like the rest of OnlineUtilities. Check back
        shortly or explore the tools that are ready today.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/tools">Browse available tools</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">
            <Bell className="size-4" />
            Request an update
          </Link>
        </Button>
      </div>
    </div>
  );
}
