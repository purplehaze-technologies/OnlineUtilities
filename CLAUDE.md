# CLAUDE.md

Context for AI coding agents working in **OnlineUtilities**. Read this before making changes. For human-facing setup see [README.md](./README.md); deeper guides live in [docs/](./docs/).

## What this is

A fast, SEO-first suite of **free online utilities** (QR generator, JSON formatter, calculators, converters, …). Architected to scale from 1 to 200+ tools with **no structural changes** — almost everything is derived from a few data files.

**Current state:** foundation complete. Homepage, search, design system, SEO, all routes and 20 tool _placeholders_ are built and the production build is green. Individual tool UIs are added one at a time (QR Code Generator is first).

## Commands

```bash
npm run dev          # dev server (Turbopack) — http://localhost:3000
npm run build        # production build (must stay green)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint (must stay clean — 0 warnings)
npm run format       # prettier write
```

After any change, the bar is: **`typecheck` + `lint` + `build` all pass with zero warnings.** A Husky pre-commit hook runs `lint-staged` + `typecheck`.

## Stack (and non-negotiables)

- **Next.js 16** (App Router, RSC, Turbopack) + **React 19** + **TypeScript strict**. This is intentionally Next 16, not the PRD's "15" — it's the latest stable. **Do not downgrade.**
- **Tailwind CSS v4** — CSS-first. There is **no `tailwind.config.ts`**; design tokens live in [src/app/globals.css](./src/app/globals.css) under `:root` / `.dark` and are exposed via `@theme inline`.
- **shadcn/ui-style components** — hand-authored in [src/components/ui/](./src/components/ui/) on Radix primitives. We own this code; edit it directly. There is no shadcn CLI step.
- **Native sitemap/robots** (`app/sitemap.ts`, `app/robots.ts`) — **not** `next-sitemap`. Don't add it.
- Path alias: `@/*` → `src/*`.

## Architecture: data-driven everything

The single source of truth is [src/lib/data/](./src/lib/data/):

- [tools.ts](./src/lib/data/tools.ts) — the `Tool[]` array + query helpers (`getToolBySlug`, `getFeaturedTools`, `getToolsByCategory`, `getRelatedTools`, `searchTools`, …).
- [categories.ts](./src/lib/data/categories.ts) — the `Category[]` array.
- [icons.ts](./src/lib/data/icons.ts) — string-key → Lucide component registry.
- [faqs.ts](./src/lib/data/faqs.ts) — homepage FAQ content.

The homepage, `/tools`, category pages, related-tools, search, and `sitemap.xml` **all render from these**. Never hardcode a tool or category card — add to the data instead.

Types are in [src/types/index.ts](./src/types/index.ts) (`Tool`, `Category`, `CategoryId`). `CategoryId` is a string union, so an invalid category on a tool is a **compile error**.

## Adding a tool (the most common task)

Two steps — see [docs/adding-a-tool.md](./docs/adding-a-tool.md) for the full worked example.

1. Add an entry to `tools.ts` (and an icon key in `icons.ts`).
2. Create `src/app/tools/<slug>/page.tsx` by copying an existing placeholder; put the UI inside `<ToolPageLayout tool={tool}>`. Set `comingSoon: false` when the UI is real.

Listing, search, SEO, breadcrumbs, related tools and the sitemap update automatically.

## SEO — always use the helpers

- Every route's `metadata` comes from `createMetadata()` in [src/lib/seo/metadata.ts](./src/lib/seo/metadata.ts). Don't hand-roll `Metadata` objects.
- JSON-LD via builders in [src/lib/seo/jsonld.ts](./src/lib/seo/jsonld.ts) (`WebSite`, `Organization`, `WebApplication`, `BreadcrumbList`, `FAQPage`), rendered with `<JsonLd>`.
- OG/Twitter images come from the **file convention** ([app/opengraph-image.tsx](./src/app/opengraph-image.tsx) / `twitter-image.tsx`). `createMetadata` only sets an image when you pass one explicitly — otherwise let the file convention supply it.
- `siteConfig` ([src/lib/constants/site.ts](./src/lib/constants/site.ts)) is the one place for site name/URL/socials; URL resolves from `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → localhost.

## Conventions

- **Server Components by default.** Add `"use client"` only for interactivity (search, theme toggle, mobile nav, clipboard).
- **Styling** through `cn()` ([src/lib/utils](./src/lib/utils/)) + CVA variants. Use token utilities (`bg-background`, `text-muted-foreground`, `border-primary/40`), not raw hex.
- **Accessibility is required:** semantic HTML, labelled controls, visible focus rings, keyboard support, WCAG AA.
- Keep tool pages tiny — logic belongs in `lib/`, hooks in `src/hooks/`, Zod schemas (per tool) in `src/lib/schemas/`.

## Gotchas (these will bite you)

- **Dynamic icons:** never write `const Icon = getIcon(x)` then `<Icon/>` — the `react-hooks/static-components` lint rule fails the build. Use `<Icon name={x} className=… />` from [src/components/shared/icon.tsx](./src/components/shared/icon.tsx).
- **Tailwind v4 arbitrary values:** `theme(colors.primary/…)` is dead. Use `var(--primary)` (e.g. `bg-[radial-gradient(…,var(--primary),transparent)]`) or `color-mix(...)`.
- **Dark mode** is class-based (`.dark` via `@custom-variant` in globals.css). `next-themes` is configured `attribute="class"`; `<html>` has `suppressHydrationWarning`.
- **`Badge` has no `asChild`** — wrap it in a `<Link>` rather than passing `asChild`.
- **Async route params:** `params` is a `Promise` in Next 16 — `await` it in pages/`generateMetadata`.
- **lucide-react** icon names must exist in the installed version; `getIcon()` falls back to `Wrench` if a registry key is missing.

## Where things live

```
src/app/            routes (marketing group, tools/, categories/[category], sitemap/robots/manifest, OG images)
src/components/ui/        base primitives        src/components/layout/   header/footer/nav/breadcrumb/theme
src/components/tool/      tool-card, tool-search, tool-page-layout, …
src/components/shared/    icon, json-ld, faq-section, empty-state, page-shell, section-heading
src/components/providers/ theme-provider, analytics
src/lib/data/   ← source of truth   src/lib/seo/   src/lib/constants/   src/lib/utils/   src/lib/schemas/
src/hooks/   src/types/
```

## Deep docs (read on demand)

This file is the always-loaded summary; load these from [docs/](./docs/) for the task at hand:

- Building a tool → [tool-template.md](./docs/tool-template.md), [adding-a-tool.md](./docs/adding-a-tool.md), [release-checklist.md](./docs/release-checklist.md)
- How/why it's built → [architecture.md](./docs/architecture.md), [adr/](./docs/adr/)
- Conventions → [component-conventions.md](./docs/component-conventions.md), [design-system.md](./docs/design-system.md)
- SEO / perf / tests → [seo-guide.md](./docs/seo-guide.md), [performance.md](./docs/performance.md), [testing.md](./docs/testing.md)
- Direction → [roadmap.md](./docs/roadmap.md)
