import { siteConfig } from "@/lib/constants/site";
import { createMetadata } from "@/lib/seo";
import { PageShell } from "@/components/shared/page-shell";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: `The terms that govern your use of ${siteConfig.name}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of Service"
      lead="The basic terms for using OnlineUtilities."
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Terms of Service", path: "/terms" },
      ]}
    >
      <p>
        <strong>Last updated:</strong> This is a template terms document and
        should be reviewed by a legal professional before launch.
      </p>
      <h2>Acceptance of terms</h2>
      <p>
        By accessing or using {siteConfig.name}, you agree to be bound by these
        terms. If you do not agree, please do not use the service.
      </p>
      <h2>Use of the tools</h2>
      <p>
        The tools are provided free of charge for lawful personal and commercial
        use. You are responsible for the content you process with them.
      </p>
      <h2>No warranty</h2>
      <p>
        The service is provided &quot;as is&quot; without warranties of any
        kind. While we strive for accuracy, you should verify critical results
        independently.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        {siteConfig.name} is not liable for any damages arising from the use of,
        or inability to use, the service.
      </p>
      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the
        service constitutes acceptance of the updated terms.
      </p>
    </PageShell>
  );
}
