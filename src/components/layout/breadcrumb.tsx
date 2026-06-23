import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/shared/json-ld";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Accessible breadcrumb trail that also emits BreadcrumbList JSON-LD.
 * The last item is rendered as the current page (no link).
 */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {isLast ? (
                  <span
                    aria-current="page"
                    className="text-foreground font-medium"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
                {!isLast ? (
                  <ChevronRight className="size-4 shrink-0" aria-hidden />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}
