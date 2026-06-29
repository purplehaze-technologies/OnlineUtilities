# Changelog

All notable changes to OnlineUtility are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Versioning Policy

- **MAJOR** (`x.0.0`) — breaking changes to the public site URL structure or data-file API
- **MINOR** (`0.x.0`) — new tools, new features, notable improvements
- **PATCH** (`0.0.x`) — bug fixes, dependency updates, documentation changes

---

## [Unreleased]

### Added

- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `ROADMAP.md`, `CHANGELOG.md` — full GitHub community health files

---

## [0.1.0] — 2026-06-29

Initial public release. Foundation complete and 20 tools registered.

### Added

#### Infrastructure

- Next.js 16 (App Router, RSC, Turbopack) + React 19 + TypeScript strict project
- Tailwind CSS v4 CSS-first design system; all design tokens in `src/app/globals.css`
- Dark mode via `next-themes` (`attribute="class"`) and `@custom-variant` in globals
- Radix UI primitive components: `Button`, `Input`, `Label`, `Badge`, `Accordion`, `DropdownMenu`, `Slot`
- `cn()` utility (clsx + tailwind-merge), CVA for variant-driven components
- Path alias `@/*` → `src/*`
- Husky pre-commit hook: `lint-staged` (ESLint + Prettier) + `tsc --noEmit`

#### Data Layer

- `src/lib/data/tools.ts` — single source of truth for all tools; query helpers (`getToolBySlug`, `getAllToolSlugs`, `getFeaturedTools`, `getToolsByCategory`, `getRelatedTools`, `searchTools`)
- `src/lib/data/categories.ts` — category definitions
- `src/lib/data/icons.ts` — string-key → Lucide component registry
- `src/lib/data/faqs.ts` — homepage FAQ content
- `src/types/index.ts` — `Tool`, `Category`, `CategoryId` (compile-time checked union)

#### Routes & Pages

- Homepage with hero, featured tools grid, category cards, and FAQ section
- `/tools` — full tool listing with live search (`ToolSearch`) and category filter
- `/categories/[category]` — category-level listing pages
- `src/app/tools/<slug>/page.tsx` — individual tool pages with `ToolPageLayout`
- `app/sitemap.ts` — auto-generated XML sitemap from `tools.ts`
- `app/robots.ts` — robots.txt
- `app/manifest.ts` — Web App Manifest
- `app/opengraph-image.tsx` / `app/twitter-image.tsx` — edge-rendered OG images

#### SEO

- `createMetadata()` in `src/lib/seo/metadata.ts` — every route uses this; no hand-rolled `Metadata` objects
- JSON-LD builders: `WebSite`, `Organization`, `WebApplication`, `BreadcrumbList`, `FAQPage`
- `<JsonLd>` component for inline structured data
- `siteConfig` in `src/lib/constants/site.ts` — single source for site name, URL, socials

#### Components

- `<ToolPageLayout>` — wraps every tool page with header, related tools, breadcrumb
- `<ToolWorkbench>`, `<ToolPanel>`, `<ToolField>` — composable tool UI primitives
- `<CopyButton>` — clipboard copy with visual feedback
- `<ToolCard>` — tool listing card
- `<ToolSearch>` — client-side live search with URL sync
- `<Icon name={key} />` — safe dynamic icon from registry (avoids React hooks lint rule)
- `<Header>`, `<Footer>`, `<Breadcrumb>`, `<ThemeToggle>`, `<MobileNav>`
- `<PageShell>`, `<SectionHeading>`, `<FaqSection>`, `<EmptyState>`

#### Tools (20 implemented)

- **QR & Barcode:** QR Code Generator, Barcode Generator
- **Developer:** UUID Generator, JSON Formatter, JWT Decoder, Base64 Encoder/Decoder, Image to Base64
- **Image:** Color Picker
- **Calculators:** Age Calculator, GST Calculator, SIP Calculator, EMI Calculator
- **Text:** Word Counter, Case Converter, Markdown Previewer
- **SEO:** Meta Tag Generator, Sitemap Generator, Schema Generator
- **Utilities:** Password Generator, Slug Generator

#### Analytics

- Vercel Analytics (`@vercel/analytics`)
- Vercel Speed Insights (`@vercel/speed-insights`)

---

## Categories: Reference

| Category     | Description                                  |
| ------------ | -------------------------------------------- |
| `Added`      | New features, tools, or files                |
| `Changed`    | Changes to existing functionality            |
| `Deprecated` | Features to be removed in a future version   |
| `Removed`    | Features removed in this release             |
| `Fixed`      | Bug fixes                                    |
| `Security`   | Vulnerability fixes or security improvements |

---

[Unreleased]: https://github.com/your-org/OnlineUtility/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/OnlineUtility/releases/tag/v0.1.0
