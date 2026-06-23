import Link from "next/link";
import { Compass, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <span className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
        <Compass className="size-7" aria-hidden />
      </span>
      <p className="text-primary mt-6 text-sm font-semibold tracking-wide uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        Page not found
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
        Let&apos;s get you back on track.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="size-4" />
            Go home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/tools">Browse tools</Link>
        </Button>
      </div>
    </div>
  );
}
