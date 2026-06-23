# Architecture

How OnlineUtilities is structured and **why**. Aimed at anyone (human or AI) extending the project.

## Goals

Fast, SEO-first, mobile-first, accessible, modular — and able to grow from 1 to 200+ tools without restructuring. Every decision optimizes for performance, SEO, reusability and developer experience.

## Rendering model

- **App Router + React Server Components.** Pages are Server Components by default and prerender to static HTML (`○ Static` / `●  SSG` in the build output). This gives near-perfect Lighthouse SEO/performance and per-route metadata for free.
- **Client Components are the exception**, marked `"use client"`: theme toggle, mobile nav, tool search, clipboard hook, and (future) interactive tool UIs. Keep the client boundary as small and as deep in the tree as possible.
- Tool **pages stay Server Components** (so `generateMetadata` is static); the interactive part is a nested client component.

## The data layer (why it's central)

All content-driven surfaces render from [src/lib/data/](../src/lib/data/):

| File            | Provides                                               |
| --------------- | ------------------------------------------------------ |
| `tools.ts`      | `Tool[]` + lookups/queries (search, featured, related) |
| `categories.ts` | `Category[]` + slug/id lookups                         |
| `icons.ts`      | string-key → Lucide component registry                 |
| `faqs.ts`       | FAQ content (UI + JSON-LD)                             |

Consumers — homepage, `/tools`, `/categories/[category]`, related tools, search, and `sitemap.ts` — never hardcode content. **Adding data propagates everywhere.** This is the core mechanism that makes scaling to 200+ tools a data task, not an engineering task.

Types (`Tool`, `Category`, `CategoryId`) live in [src/types/index.ts](../src/types/index.ts). `CategoryId` being a union turns invalid references into compile errors.

### Why an icon registry?

Data stays serializable (strings, not component references), while Lucide imports remain in one module so `optimizePackageImports` can tree-shake them. The `<Icon name=…>` component resolves the key at render via `createElement`, which also sidesteps the `react-hooks/static-components` rule.

## Design system

- **Tailwind v4, CSS-first.** Tokens are CSS variables in [globals.css](../src/app/globals.css) (`:root` + `.dark`), surfaced to utilities through `@theme inline`. No `tailwind.config.ts`.
- **Tokens, not hex.** Components use semantic utilities (`bg-card`, `text-muted-foreground`, `ring-ring`) so light/dark and future re-theming "just work".
- **shadcn/ui style, owned.** Primitives in [src/components/ui/](../src/components/ui/) are hand-authored on Radix (Slot, DropdownMenu, Accordion) with **CVA** variants + `cn()` (clsx + tailwind-merge). No runtime UI dependency, full a11y, fully editable.
- **Dark mode** via `next-themes` (`attribute="class"`, light/dark/system, no flash; `<html suppressHydrationWarning>`).

## Component layers

| Layer                   | Responsibility                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `components/ui/`        | Generic primitives (button, input, card, badge, accordion, …)                                      |
| `components/layout/`    | App chrome: header, footer, nav, mobile nav, breadcrumb, theme                                     |
| `components/tool/`      | Domain pieces: tool-card, category-card, tool-search, tool-page-layout, related-tools, coming-soon |
| `components/shared/`    | Cross-cutting: icon, json-ld, faq-section, empty-state, page-shell, section-heading                |
| `components/providers/` | `ThemeProvider`, `Analytics`                                                                       |

`ToolPageLayout` is the key reuse point: it standardizes every tool page (breadcrumb + header + related tools + `WebApplication` JSON-LD), so a tool page is ~15 lines.

## SEO infrastructure

- **`createMetadata()`** ([src/lib/seo/metadata.ts](../src/lib/seo/metadata.ts)) — one factory for titles, descriptions, keywords, canonical URLs, Open Graph and `summary_large_image` Twitter cards. Used by every route for consistency.
- **JSON-LD builders** ([src/lib/seo/jsonld.ts](../src/lib/seo/jsonld.ts)) — pure functions for `WebSite`, `Organization`, `WebApplication`, `BreadcrumbList`, `FAQPage`, rendered by `<JsonLd>`. `WebSite` includes a `SearchAction`; `Breadcrumb`/`FaqSection` components emit their JSON-LD alongside the UI.
- **Native `sitemap.ts` + `robots.ts` + `manifest.ts`** — type-safe, zero-dep, derived from the data files. Chosen over `next-sitemap`.
- **OG/Twitter images** generated with `next/og` via the file convention, so every route inherits a branded card without per-page work.
- **One config, one switch.** `siteConfig` ([src/lib/constants/site.ts](../src/lib/constants/site.ts)) resolves the canonical URL from `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → localhost, so the Vercel-URL → custom-domain migration is a single env change that updates metadata, canonicals, sitemap and JSON-LD everywhere.

## Analytics

[src/components/providers/analytics.tsx](../src/components/providers/analytics.tsx) conditionally loads GA4, Microsoft Clarity and Vercel Analytics based on `NEXT_PUBLIC_*` env vars. No IDs are hardcoded and each provider no-ops when unset, keeping local dev clean.

## Routing map

| Route                                                | Type   | Source                                   |
| ---------------------------------------------------- | ------ | ---------------------------------------- |
| `/`                                                  | Static | homepage sections + `ToolSearch`         |
| `/tools`                                             | Static | full list + search                       |
| `/tools/[slug]` (×20)                                | Static | `ToolPageLayout` + tool UI               |
| `/categories/[category]` (×8)                        | SSG    | `generateStaticParams` from `categories` |
| `/about` `/contact` `/privacy` `/terms`              | Static | `(marketing)` group + `PageShell`        |
| `/sitemap.xml` `/robots.txt` `/manifest.webmanifest` | Static | data-derived                             |
| `/opengraph-image` `/twitter-image`                  | Static | `next/og`                                |

## Performance & accessibility posture

- Static-first rendering; `optimizePackageImports` for `lucide-react`; `next/font` with `display: swap`; security headers in `next.config.ts`.
- Search is fully client-side over the in-memory dataset (`useDeferredValue` keeps typing smooth) — no network, no dependency.
- Semantic landmarks, skip-to-content link, labelled controls, visible focus rings, keyboard-navigable nav/menus, WCAG AA color tokens.

## Key trade-offs / decisions

- **Next 16 over the PRD's "Next 15"** — `create-next-app@latest` ships 16 as latest stable, and the PRD also asked for latest stable. App Router architecture is identical.
- **Native sitemap over `next-sitemap`** — type-safe and auto-synced with data; one fewer dependency and build step.
- **Hand-authored shadcn components over the CLI** — deterministic in this environment and we own the code outright.
- **All tools start `comingSoon: true`** — they ship with full SEO + a polished placeholder so the site is launchable before any tool logic exists; flip the flag per tool as UIs land.
