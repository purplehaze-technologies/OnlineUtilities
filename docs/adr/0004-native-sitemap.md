# ADR-0004: Native sitemap/robots over `next-sitemap`

- **Status:** Accepted
- **Date:** 2026-06-23

## Context

The PRD suggested `next-sitemap`. The App Router now provides native, type-safe `sitemap.ts`, `robots.ts` and `manifest.ts` conventions. We need the sitemap to always reflect the full tool/category set without manual upkeep.

## Decision

Use the **native** `app/sitemap.ts`, `app/robots.ts` and `app/manifest.ts`, deriving entries from the data files ([ADR-0002](./0002-data-driven-architecture.md)).

## Alternatives considered

- **`next-sitemap`** — a post-build step generating static `sitemap.xml`/`robots.txt`. Works, but adds a dependency and a build script, generates from crawled/static config rather than our typed data, and is redundant now that the framework has a first-class API.

## Consequences

- **Positive:** zero extra dependency/build step; type-safe; the sitemap is generated from the same data as the pages, so it can't go stale; per-entry `priority`/`changeFrequency` set in code (featured tools boosted).
- **Negative / trade-offs:** none material for our use; very advanced sitemap features (e.g. index splitting for huge sites) would need custom code, but we're far from that scale.
- **Follow-ups:** do **not** add `next-sitemap`. New tools/categories appear in the sitemap automatically.
