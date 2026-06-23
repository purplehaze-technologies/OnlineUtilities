# Roadmap

A living planning document for direction beyond the current code. It captures **intent** that isn't derivable from the repo. The 20 currently-planned tools live in [`tools.ts`](../src/lib/data/tools.ts) (all `comingSoon: true`); this doc is about what comes after, and the goals that shape decisions. Not a commitment — revise freely.

## Now (foundation — done)

Project scaffold, design system, data-driven architecture, SEO infrastructure, search, all routes + 20 tool placeholders. Production build green.

## Next

1. **First real tools.** Implement UIs, flipping `comingSoon: false` one at a time, starting with the **QR Code Generator**. Good early candidates (client-only, low dependency): Password Generator, UUID Generator, Case Converter, Word Counter, Slug Generator, JSON Formatter, Base64 tools.
2. **Automated testing.** Stand up Vitest (+ RTL, axe) per [testing.md](./testing.md); wire into pre-commit/CI.
3. **Per-tool OG images & FAQs** for the launched tools (SEO leverage).
4. **Custom domain.** Flip `NEXT_PUBLIC_SITE_URL`; submit sitemap to Search Console.

## Later — candidate tool categories

Beyond the eight current categories, potential expansions (add to `categories.ts` + `CategoryId` when pursued):

- **PDF tools** (merge/split/compress) — heavier, client-side where feasible.
- **Unit & currency converters** (length, weight, temperature, time zones).
- **Date/time tools** (countdown, cron parser, timestamp converter).
- **Crypto/encoding** (hashing, HTML entity, URL encode/decode).
- **Color/design** (palette generator, contrast checker, gradient maker).
- **Image tools** (resize, compress, format convert) — `dynamic()`-loaded libs.

## Goals (what success looks like)

### SEO

- Each launched tool ranks for its primary query; rich results (FAQ/breadcrumb) showing in SERPs.
- Strong internal-linking graph across related tools and category hubs.
- Programmatic, always-fresh sitemap; healthy Search Console coverage.

### Performance

- Sustain Lighthouse ≥ 95 / 100 / 100 / 100 and Core Web Vitals targets ([performance.md](./performance.md)) as tools are added.
- Keep the static-first model; no per-tool bundle regressions (heavy libs lazy-loaded).

### Analytics

- Enable GA4 + Clarity in production (providers already env-gated).
- Track tool usage to prioritize the roadmap by real demand; watch funnels and search queries on `/tools`.

## Exploratory ideas (unvalidated)

> Parked thoughts, not planned work. Recorded so the context isn't lost.

- **Internationalization (i18n).** Architecture is i18n-friendly (token-based UI, data-driven content). If pursued, use Next's i18n routing, externalize copy, add `hreflang` and locale-aware canonical/sitemap. Significant SEO and content-ops investment — validate demand first.
- **Public API.** Some tools (slug, UUID, hashing, formatting) could expose a small JSON API under `/api/*` (already disallowed in robots) for developers. Watch for abuse/rate-limiting needs.
- **Browser extension.** Surface the most-used tools (color picker, JSON formatter, base64) as a lightweight extension sharing the core `lib/` logic.
- **AI-powered utilities.** Optional, clearly-labeled tools (e.g. text summarizer, regex explainer, JSON↔types). Would introduce a server/runtime cost and a provider dependency — would warrant its own ADR, cost controls, and a privacy review (contrast with the current "data stays on device" promise).
- **Monetization.** If ever pursued, prefer non-intrusive options that don't compromise speed/privacy/UX: tasteful contextual placements or sponsorships over heavy ad networks; possibly a "pro" tier for batch/API usage. Must not regress Core Web Vitals.

## How to use this doc

- When picking up work, start from "Next".
- Promoting an idea to planned work that changes architecture → write an [ADR](./adr/).
- Adding tools/categories → follow [tool-template.md](./tool-template.md) and [adding-a-tool.md](./adding-a-tool.md). Keep this roadmap roughly in sync, but `tools.ts` remains the source of truth for what exists.
