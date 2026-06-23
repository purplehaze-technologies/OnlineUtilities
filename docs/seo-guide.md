# SEO Guide

SEO is the project's top priority — every tool is meant to become a ranking landing page. This guide covers the strategy and the mechanics. The infrastructure that implements it is described in [architecture.md](./architecture.md#seo-infrastructure); this doc is about **how to use it well**.

## Principles

1. **One tool = one focused landing page** targeting a specific query (e.g. "qr code generator", "json formatter").
2. **Static-first.** Pages prerender to HTML so crawlers get full content with no JS.
3. **Derived, consistent metadata.** Never hand-roll a `Metadata` object — use the factory.
4. **Structured data on every page** to qualify for rich results.

---

## Metadata strategy

Every route exports metadata via `createMetadata()` ([src/lib/seo/metadata.ts](../src/lib/seo/metadata.ts)):

```ts
export const metadata = createMetadata({
  title: "JSON Formatter", // → "JSON Formatter | OnlineUtilities"
  description: "Beautify, minify and validate JSON with instant error hints.",
  path: "/tools/json-formatter", // → canonical + og:url
  keywords: ["json", "beautify", "minify", "validate"],
});
```

What the factory guarantees: branded title template, canonical URL (`alternates.canonical`), merged site + page keywords, robots directives (`index, follow`, `max-image-preview:large`), Open Graph (`type: website`, siteName, locale) and Twitter `summary_large_image`.

**Rules**

- `title`: the primary keyword phrase, human-readable. Don't stuff.
- `description`: unique per page, ~150–160 chars, compelling, includes the primary keyword naturally. This is also the `tools.ts` `description` for the card — keep them aligned.
- `path`: always pass it (canonical correctness depends on it).
- For tool pages, prefer `generateMetadata()` reading from `tools.ts` so the card and the page never drift (see [adding-a-tool.md](./adding-a-tool.md)).

## Page structure

`ToolPageLayout` enforces good structure:

- Exactly **one `<h1>`** = the tool name.
- Section headings are `<h2>` (related tools, FAQ). Keep the hierarchy linear — never skip levels.
- Lead copy (`longDescription`) sits directly under the H1 with the keyword in the first sentence.

## Keyword placement

Put the primary keyword in, roughly in priority order:

1. `title`
2. `<h1>` (tool name)
3. First sentence of `longDescription`
4. `description` meta
5. `keywords[]` (plus synonyms/aliases users actually search)
6. FAQ questions/answers

Write for humans first. Use natural synonyms (e.g. "GUID" alongside "UUID") rather than repeating one term.

## Internal linking strategy

Internal links spread crawl equity and keep users on-site:

- **Automatic:** every tool page links to same-category tools via `RelatedTools`; header/footer link to `/tools` and categories; breadcrumbs link up the tree.
- **Manual (do this):** add at least one **contextual** in-copy link to a genuinely related tool (e.g. "Base64 Encoder" ↔ "Image to Base64"). Use descriptive anchor text (the tool name), not "click here".
- Category pages (`/categories/[category]`) are hubs — make sure each tool's `category` is right so it appears on the correct hub.

## Structured data (JSON-LD)

Builders live in [src/lib/seo/jsonld.ts](../src/lib/seo/jsonld.ts); render with `<JsonLd>`.

| Schema           | Where                                | How                                |
| ---------------- | ------------------------------------ | ---------------------------------- |
| `WebSite`        | Root layout (site-wide)              | automatic; includes `SearchAction` |
| `Organization`   | Root layout (site-wide)              | automatic                          |
| `WebApplication` | Every tool page                      | automatic via `ToolPageLayout`     |
| `BreadcrumbList` | Any page with `<Breadcrumb>`         | automatic                          |
| `FAQPage`        | Pages with `<FaqSection withJsonLd>` | render the component               |

**FAQ schema:** the single highest-leverage rich result for tools. Add 3–6 genuine Q&As per tool. Use `<FaqSection faqs={…} />`; it renders the accordion _and_ the JSON-LD from the same data, so they can never disagree.

**Breadcrumb schema:** automatic — just pass the trail to `<Breadcrumb>`. Order: Home → Tools → Tool (or → Category).

Always validate new structured data with the [Rich Results Test](https://search.google.com/test/rich-results).

## Canonical URLs

- Set automatically from `path` via `alternates.canonical`, resolved against `metadataBase` (the site URL).
- Never let two routes claim the same canonical. One tool, one slug, one canonical.
- The site URL comes from `siteConfig` (`NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → localhost), so the Vercel→custom-domain switch updates all canonicals at once.

## Open Graph & Twitter Cards

- Both come from `createMetadata` (text) + the `next/og` **file convention** ([app/opengraph-image.tsx](../src/app/opengraph-image.tsx), `twitter-image.tsx`) for the image, which cascades to all routes.
- `createMetadata` only sets an image when you pass `image:` — otherwise the file-convention image is used. To give a tool a custom card, add `app/tools/<slug>/opengraph-image.tsx`.
- Twitter card type is always `summary_large_image` (1200×630).

## Image SEO

- Use `next/image` for any content image (lazy-loading, responsive `srcset`, correct dimensions → no CLS).
- Always set meaningful `alt`. Decorative images get `alt=""` + `aria-hidden`.
- Provide explicit `width`/`height` (or `fill` + sized container) to reserve space.
- Prefer SVG for icons/logos.

## Sitemap & robots strategy

- [app/sitemap.ts](../src/app/sitemap.ts) is **data-derived** — every tool/category in the data files is included automatically, with `priority` boosted for featured tools. You never edit the sitemap by hand.
- [app/robots.ts](../src/app/robots.ts) allows all, disallows `/api/`, and points to the sitemap.
- After launching tools, (re)submit `/sitemap.xml` in Google Search Console.

---

## Per-tool SEO checklist (release gate)

Every tool must satisfy this before `comingSoon: false` (mirrored in [release-checklist.md](./release-checklist.md)):

- [ ] Unique, keyword-rich `title` and `description` via `createMetadata`
- [ ] Canonical `path` set and correct
- [ ] Single H1 (tool name); logical H2s
- [ ] Primary keyword in title, H1, first sentence, description
- [ ] `keywords[]` includes real synonyms/aliases
- [ ] ≥ 1 contextual internal link in copy (plus automatic related tools)
- [ ] `WebApplication` + `BreadcrumbList` JSON-LD present
- [ ] `FAQPage` JSON-LD present (FAQ written) where sensible
- [ ] OG/Twitter card resolves (`summary_large_image`)
- [ ] Any images use `next/image` with `alt` and reserved dimensions
- [ ] Tool appears in `/sitemap.xml`
- [ ] Validated in the Rich Results Test
