import { siteConfig } from "@/lib/constants/site";
import { createMetadata } from "@/lib/seo";
import { PageShell } from "@/components/shared/page-shell";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your data — short version: your input stays on your device wherever possible.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      lead="Your privacy matters. Here's how we handle data on OnlineUtilities."
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Privacy Policy", path: "/privacy" },
      ]}
    >
      <p>
        <strong>Last updated:</strong> This is a template privacy policy and
        should be reviewed by a legal professional before launch.
      </p>
      <h2>Data we process</h2>
      <p>
        Most of our tools run entirely in your browser. The content you enter
        into those tools is processed locally on your device and is not sent to
        or stored on our servers.
      </p>
      <h2>Analytics</h2>
      <p>
        We may use privacy-conscious analytics to understand aggregate usage
        (for example, which tools are popular). These analytics do not identify
        you personally and are only enabled when configured.
      </p>
      <h2>Cookies</h2>
      <p>
        We use minimal cookies or local storage only where necessary, such as
        remembering your light/dark theme preference.
      </p>
      <h2>Third-party services</h2>
      <p>
        Some optional features (such as analytics) rely on third-party providers
        that have their own privacy policies.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy? Reach us via the{" "}
        <a href="/contact">contact page</a>.
      </p>
    </PageShell>
  );
}
