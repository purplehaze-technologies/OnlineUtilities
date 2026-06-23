# ADR-0001: Next.js (App Router) as the framework

- **Status:** Accepted
- **Date:** 2026-06-23

## Context

OnlineUtilities must be **SEO-first, fast, and mobile-first**, and scale to 200+ tool landing pages. The dominant requirement is that each tool page is a crawlable, high-Lighthouse landing page that ranks. The tools themselves are mostly client-side, in-browser utilities. We need per-route metadata, static generation, and a component model that keeps shipped JS minimal.

## Decision

Use **Next.js with the App Router** (React Server Components, file-based routing, the Metadata API), deployed on Vercel.

## Alternatives considered

- **Angular / Vue SPA** — client-rendered SPAs are weak for content SEO without bolt-on SSR; per-page metadata and static HTML are first-class in Next, not afterthoughts. React also has the largest ecosystem for the UI primitives we want.
- **Next.js Pages Router** — viable, but the App Router gives us RSC (less client JS by default), nested layouts, and file-based `sitemap`/`robots`/`opengraph-image` conventions that directly serve our SEO goals.
- **Astro** — excellent for static content and "islands", and a real contender. Rejected because the tools are interactive React apps; staying in one React/Next model keeps the interactive and content stories unified, with a richer component ecosystem.
- **Plain Vite + React SPA** — would require hand-building routing, SSG and metadata/SEO infrastructure that Next provides out of the box.

## Consequences

- **Positive:** static-first rendering → near-perfect SEO/performance; per-route `Metadata`; file conventions for sitemap/robots/OG images; RSC keeps the static shell JS-light; zero-config Vercel deploys.
- **Negative / trade-offs:** App Router has a learning curve (Server vs Client boundaries, async `params`); tied to the React/Next release cadence.
- **Follow-ups:** keep tool pages as Server Components and isolate interactivity in nested Client Components (see [ADR-0002](./0002-data-driven-architecture.md) and [../component-conventions.md](../component-conventions.md)).
