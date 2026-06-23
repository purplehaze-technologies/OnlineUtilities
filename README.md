# OnlineUtilities

A fast, modern, SEO-first suite of **free online utilities** — QR code generator, JSON formatter, password generator, calculators, converters and more. Built to scale from one tool to 200+ without architectural changes.

> **Status:** Foundation + placeholder tool pages. The homepage, search, design system, SEO infrastructure and all routes are implemented. Individual tool UIs (starting with the QR Code Generator) are added incrementally.

---

## Tech Stack

| Concern    | Choice                                                       |
| ---------- | ------------------------------------------------------------ |
| Framework  | **Next.js 16** (App Router, RSC, Turbopack)                  |
| UI runtime | **React 19**                                                 |
| Language   | **TypeScript** (strict)                                      |
| Styling    | **Tailwind CSS v4** (CSS-first `@theme`)                     |
| Components | **shadcn/ui** style (hand-authored, Radix primitives)        |
| Icons      | **lucide-react** (tree-shaken via a typed registry)          |
| Variants   | **class-variance-authority** + **clsx** + **tailwind-merge** |
| Theming    | **next-themes** (light / dark / system)                      |
| Validation | **Zod** (ready for tool inputs)                              |
| Analytics  | GA4, Microsoft Clarity, **@vercel/analytics** (env-gated)    |
| Quality    | ESLint, Prettier, Husky, lint-staged                         |
| SEO        | Native Metadata API, `sitemap.ts`, `robots.ts`, JSON-LD      |

> The PRD referenced "Next.js 15"; `create-next-app` now ships **Next.js 16** as the latest stable, and the App Router architecture is identical. We track latest stable per the requirements.

### Why these choices

- **App Router + RSC** render pages as static HTML by default → near-perfect Lighthouse SEO/performance and per-route metadata.
- **Tailwind v4** is CSS-first (no JS theme config), with a smaller, faster build.
- **shadcn-style components** mean we _own_ the component code (no runtime UI dependency) while keeping Radix accessibility.
- **Data-driven everything** — one `tools.ts` array powers the homepage, search, category pages, related tools and the sitemap.
- **Native sitemap/robots** over `next-sitemap`: type-safe, zero extra deps, and automatically in sync with the data files.

---

## Folder Structure

```
src/
  app/
    (marketing)/            # about, contact, privacy, terms (route group)
    categories/[category]/  # SSG category landing pages
    tools/                  # /tools index + one folder per tool
    layout.tsx              # root layout: theme, header/footer, SEO defaults
    page.tsx                # homepage
    sitemap.ts robots.ts manifest.ts
    opengraph-image.tsx twitter-image.tsx
    not-found.tsx loading.tsx globals.css
  components/
    ui/         # base primitives (button, input, card, badge, accordion, …)
    layout/     # site-header, site-footer, mobile-nav, breadcrumb, theme-toggle
    tool/       # tool-card, category-card, tool-search, tool-page-layout, …
    shared/     # icon, json-ld, faq-section, empty-state, section-heading, …
    providers/  # theme-provider, analytics
  lib/
    constants/  # site config, navigation
    data/       # tools, categories, icons, faqs  ← single source of truth
    seo/        # createMetadata factory + JSON-LD builders
    utils/      # cn(), slugify(), formatNumber(), …
    schemas/    # (Zod schemas for tool inputs — added with each tool)
  hooks/        # use-copy-to-clipboard, …
  types/        # Tool, Category, CategoryId
```

---

## Getting Started

Requirements: **Node 20+** and **npm**.

```bash
npm install
cp .env.example .env.local   # optional — everything no-ops without it
npm run dev                  # http://localhost:3000
```

### Scripts

| Script                 | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the dev server (Turbopack) |
| `npm run build`        | Production build                 |
| `npm run start`        | Serve the production build       |
| `npm run lint`         | ESLint                           |
| `npm run lint:fix`     | ESLint with autofix              |
| `npm run typecheck`    | `tsc --noEmit`                   |
| `npm run format`       | Prettier write                   |
| `npm run format:check` | Prettier check                   |

A Husky **pre-commit** hook runs `lint-staged` (ESLint + Prettier on staged files) and a full `typecheck`.

---

## Environment Variables

All variables are **optional**; each feature no-ops cleanly when its variable is absent. See [`.env.example`](./.env.example).

| Variable                               | Purpose                                    |
| -------------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                 | Canonical URL (metadata, sitemap, JSON-LD) |
| `NEXT_PUBLIC_GA_ID`                    | Google Analytics 4 measurement ID          |
| `NEXT_PUBLIC_CLARITY_ID`               | Microsoft Clarity project ID               |
| `NEXT_PUBLIC_VERCEL_ANALYTICS`         | `"true"` to enable Vercel Analytics        |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console verification token          |

If `NEXT_PUBLIC_SITE_URL` is unset, the app falls back to `VERCEL_URL` (on Vercel) or `http://localhost:3000`.

---

## Adding a New Tool

Adding a tool takes **two steps** — the architecture handles listing, search, SEO and the sitemap automatically.

1. **Add a data entry** in [`src/lib/data/tools.ts`](./src/lib/data/tools.ts) (and an icon key in [`src/lib/data/icons.ts`](./src/lib/data/icons.ts)):

   ```ts
   {
     id: "my-tool",
     name: "My Tool",
     slug: "my-tool",
     description: "What it does, in one SEO-friendly line.",
     category: "developer",
     icon: "my-tool",       // key in icons.ts
     keywords: ["alias", "synonym"],
     featured: false,
     comingSoon: false,     // false once the UI is built
   }
   ```

2. **Create the route** `src/app/tools/my-tool/page.tsx` (copy any existing placeholder). Replace `<ComingSoon />` with your tool UI inside `<ToolPageLayout>`:

   ```tsx
   export default function Page() {
     const tool = getToolBySlug("my-tool");
     if (!tool) notFound();
     return (
       <ToolPageLayout tool={tool}>{/* your tool UI here */}</ToolPageLayout>
     );
   }
   ```

That's it — the homepage, `/tools`, category page, related-tools, search and `sitemap.xml` update automatically.

---

## SEO

- **Metadata** — every route uses the `createMetadata()` factory for consistent titles, descriptions, keywords, canonical URLs, Open Graph and Twitter (`summary_large_image`) cards.
- **JSON-LD** — reusable builders for `WebSite`, `Organization`, `WebApplication`, `BreadcrumbList` and `FAQPage` (`src/lib/seo/jsonld.ts`).
- **Sitemap / robots** — native `app/sitemap.ts` and `app/robots.ts`, derived from the data files.
- **Social images** — branded OG/Twitter images generated with `next/og`.

---

## Coding Standards

- **Server Components by default**; `"use client"` only where interactivity is required (theme toggle, mobile nav, search).
- **Data-driven** — never hardcode tool/category cards; render from `lib/data`.
- **Typed icons** via the registry; data stays serializable.
- **Accessibility** — semantic HTML, labelled controls, visible focus rings, keyboard support, WCAG AA.
- **Styling** through `cn()` + CVA variants; tokens live in `globals.css`.
- Formatting and linting are enforced on commit.

---

## Deployment (Vercel)

Zero-config. Import the repo into Vercel and deploy.

1. Set `NEXT_PUBLIC_SITE_URL` to your deployment URL (initially `https://online-utilities.vercel.app`).
2. Add any analytics env vars you want enabled.
3. Deploy — all routes are statically optimized.

When a custom domain is added later, update `NEXT_PUBLIC_SITE_URL`; metadata, canonical URLs, sitemap and JSON-LD update everywhere automatically.

---

## License

See [LICENSE](./LICENSE).
