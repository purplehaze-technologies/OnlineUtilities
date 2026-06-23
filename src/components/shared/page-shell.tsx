import {
  Breadcrumb,
  type BreadcrumbItem,
} from "@/components/layout/breadcrumb";

/**
 * Standard wrapper for content pages (about, legal, etc.): breadcrumb, title,
 * optional lead paragraph and a readable prose column.
 */
export function PageShell({
  title,
  lead,
  breadcrumbs,
  children,
}: {
  title: string;
  lead?: string;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Breadcrumb items={breadcrumbs} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        {lead ? (
          <p className="text-muted-foreground mt-3 text-lg">{lead}</p>
        ) : null}
      </header>
      <div className="text-muted-foreground [&_h2]:text-foreground [&_p_a]:text-primary [&_strong]:text-foreground mt-8 max-w-3xl space-y-4 leading-relaxed [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_p_a]:underline [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
