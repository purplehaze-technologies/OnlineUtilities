# ADR-0002: Data-driven tool/category architecture

- **Status:** Accepted
- **Date:** 2026-06-23

## Context

The platform must grow from 1 to 200+ tools without structural change. Tools appear in many places: the homepage, `/tools`, search, category pages, related-tools, navigation and the sitemap. If each surface maintained its own list, adding a tool would mean editing a dozen files and the lists would inevitably drift.

## Decision

Make a small set of typed data files the **single source of truth**: [`src/lib/data/tools.ts`](../../src/lib/data/tools.ts), `categories.ts`, `icons.ts`, `faqs.ts`. Every content surface derives from them via query helpers (`getToolBySlug`, `getFeaturedTools`, `getToolsByCategory`, `getRelatedTools`, `searchTools`). Adding a tool = one data entry + one thin route file.

## Alternatives considered

- **Per-page hardcoded content** — simplest initially, but doesn't scale; guarantees drift and heavy edit cost per tool.
- **CMS / database** — overkill for static, developer-authored utilities; adds infra, runtime cost and a network dependency, hurting the static-first/performance goals. Can be revisited if non-developers need to manage content.
- **MDX per tool** — good for prose, but tools are interactive apps, not articles; we'd still need structured data for listings/search/sitemap.

## Consequences

- **Positive:** adding a tool is a data task; listings, search, related tools and sitemap update automatically and stay consistent; `CategoryId` union makes invalid references compile errors; everything stays in-memory (fast, no network).
- **Negative / trade-offs:** the data files grow large; content changes require a deploy (acceptable for dev-authored tools).
- **Follow-ups:** keep icons referenced by **string key** (registry) so data stays serializable ([ADR-0001](./0001-nextjs-app-router.md) RSC boundary); never hardcode tool/category cards in components.
