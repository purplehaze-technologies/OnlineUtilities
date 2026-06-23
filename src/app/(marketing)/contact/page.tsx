import { Mail, MessageSquare } from "lucide-react";

import { siteConfig } from "@/lib/constants/site";
import { createMetadata } from "@/lib/seo";
import { PageShell } from "@/components/shared/page-shell";

export const metadata = createMetadata({
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team — feature requests, feedback and questions welcome.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageShell
      title="Contact us"
      lead="Questions, feedback or a tool you'd love to see? We're listening."
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]}
    >
      <p>
        The best way to reach us is by email. We read every message and use your
        feedback to decide which tools to build next.
      </p>

      <div className="not-prose grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:hello@onlineutilities.app"
          className="bg-card text-foreground hover:border-primary/40 flex items-start gap-3 rounded-xl border p-5 no-underline shadow-sm transition-colors"
        >
          <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
            <Mail className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block font-semibold">Email</span>
            <span className="text-muted-foreground block text-sm">
              hello@onlineutilities.app
            </span>
          </span>
        </a>
        <div className="bg-card flex items-start gap-3 rounded-xl border p-5 shadow-sm">
          <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
            <MessageSquare className="size-5" aria-hidden />
          </span>
          <span>
            <span className="text-foreground block font-semibold">
              Feature requests
            </span>
            <span className="text-muted-foreground block text-sm">
              Tell us which tool to build next.
            </span>
          </span>
        </div>
      </div>
    </PageShell>
  );
}
