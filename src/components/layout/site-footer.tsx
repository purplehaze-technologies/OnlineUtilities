import Link from "next/link";
import { Sparkles } from "lucide-react";

import { footerNav } from "@/lib/constants/nav";
import { siteConfig } from "@/lib/constants/site";
import { categories } from "@/lib/data/categories";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                <Sparkles className="size-5" />
              </span>
              <span className="text-lg tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="text-muted-foreground mt-3 max-w-xs text-sm">
              {siteConfig.description}
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold">{group.title}</h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-sm font-semibold">Categories</h2>
            <ul className="mt-3 space-y-2">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm sm:flex-row">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Built for speed, privacy and simplicity.</p>
        </div>
      </div>
    </footer>
  );
}
