# ADR-0003: Centralized metadata & SEO helpers

- **Status:** Accepted
- **Date:** 2026-06-23

## Context

SEO is the top priority and every one of 200+ pages needs correct, consistent metadata: title template, canonical URL, keywords, Open Graph, Twitter card, robots directives, and JSON-LD. Hand-writing `Metadata` objects per route would be verbose and would drift — a missing canonical or inconsistent OG config on some pages would quietly hurt rankings.

## Decision

Centralize SEO in `src/lib/seo/`: a `createMetadata()` factory ([metadata.ts](../../src/lib/seo/metadata.ts)) that every route uses, and pure JSON-LD builders ([jsonld.ts](../../src/lib/seo/jsonld.ts)) rendered via `<JsonLd>`. A single `siteConfig` ([constants/site.ts](../../src/lib/constants/site.ts)) holds name/URL/socials and resolves the canonical base URL from env.

## Alternatives considered

- **Per-route hand-written `Metadata`** — maximal flexibility, but guarantees inconsistency and missed fields at scale.
- **A third-party SEO component library** — another dependency duplicating what the Next Metadata API already does well; less control.

## Consequences

- **Positive:** consistent, correct metadata everywhere by construction; one place to change titles/canonical logic; OG/Twitter image handled by the `next/og` file convention so the factory stays text-only unless overridden; switching domain is one env var.
- **Negative / trade-offs:** a small indirection to learn (use the factory, don't hand-roll); per-page customizations go through factory options.
- **Follow-ups:** every new route must use `createMetadata`; tool pages read text from `tools.ts` so the card and page never diverge. See [../seo-guide.md](../seo-guide.md).
