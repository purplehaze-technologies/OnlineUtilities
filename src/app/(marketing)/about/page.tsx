import { siteConfig } from "@/lib/constants/site";
import { createMetadata } from "@/lib/seo";
import { PageShell } from "@/components/shared/page-shell";

export const metadata = createMetadata({
  title: "About",
  description: `Learn about ${siteConfig.name} — a fast, free, privacy-friendly suite of online utilities.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageShell
      title="About OnlineUtilities"
      lead="A growing collection of fast, free and privacy-friendly online tools."
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]}
    >
      <p>
        {siteConfig.name} exists to make everyday digital tasks effortless. From
        generating QR codes and formatting JSON to crunching numbers with our
        calculators, every tool is designed to be fast, accessible and free.
      </p>
      <h2>Our principles</h2>
      <ul>
        <li>
          <strong>Speed.</strong> Tools run instantly in your browser with no
          waiting.
        </li>
        <li>
          <strong>Privacy.</strong> Wherever possible, your data never leaves
          your device.
        </li>
        <li>
          <strong>Simplicity.</strong> Clean, distraction-free interfaces that
          just work.
        </li>
        <li>
          <strong>Access for all.</strong> Mobile-first and built to WCAG AA
          accessibility standards.
        </li>
      </ul>
      <h2>Always growing</h2>
      <p>
        The platform is engineered to scale to hundreds of high-quality tools.
        New utilities are added regularly — if there&apos;s something you&apos;d
        like to see, we&apos;d love to hear from you.
      </p>
    </PageShell>
  );
}
