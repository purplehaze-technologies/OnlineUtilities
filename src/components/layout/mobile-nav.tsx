"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Wrench, X } from "lucide-react";

import { mainNav } from "@/lib/constants/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  // Lock body scroll while the menu is open.
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      <div
        className={cn(
          "bg-background fixed inset-x-0 top-16 z-40 origin-top border-b shadow-lg transition-all",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        )}
      >
        <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
          {mainNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-foreground hover:bg-accent rounded-md px-3 py-2.5 text-base font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-2">
            <Link href="/tools" onClick={() => setOpen(false)}>
              <Wrench className="size-4" />
              Browse All Tools
            </Link>
          </Button>
        </nav>
      </div>
    </div>
  );
}
