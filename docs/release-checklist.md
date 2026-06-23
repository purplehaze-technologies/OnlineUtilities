# Release Checklist

Run before shipping a new tool (or any user-facing change). Copy the checklist into the PR. Nothing ships with a failing gate.

> **Quick gate (must pass locally):**
>
> ```bash
> npm run typecheck && npm run lint && npm run build
> ```

---

## 1. Code quality

- [ ] `npm run typecheck` — no errors
- [ ] `npm run lint` — **zero** errors **and** warnings
- [ ] `npm run build` — succeeds, no warnings; the new route appears in the build output as `○ Static` or `●  SSG` (not `ƒ Dynamic`, unless intentional)
- [ ] `npm run format:check` — clean (the pre-commit hook handles this, but verify)
- [ ] No stray `console.log`, commented-out code, or `TODO`s left in shipped files
- [ ] No new dependency added without justification (see [performance.md](./performance.md))

## 2. Functionality

- [ ] Correct output on representative inputs
- [ ] Correct handling of edge cases: empty, whitespace-only, very long, invalid format, large files
- [ ] Inputs validated with Zod; invalid input shows a clear error, never a crash
- [ ] Copy / download / reset actions work
- [ ] `comingSoon` flipped to `false` in `tools.ts`

## 3. Accessibility (see [testing.md](./testing.md))

- [ ] Every control has a label (`<label>` or `aria-label`)
- [ ] Full keyboard pass: tab order logical, all actions reachable, visible focus rings
- [ ] Dynamic output announced where appropriate (`aria-live`)
- [ ] Heading order is correct (single H1 from `ToolPageLayout`, logical H2s)
- [ ] Contrast meets WCAG AA in both light and dark mode
- [ ] No keyboard trap in dialogs/menus

## 4. SEO (see [seo-guide.md](./seo-guide.md))

- [ ] `createMetadata` used with `title`, `description`, `path`, `keywords`
- [ ] Canonical URL correct (`/tools/<slug>`)
- [ ] `description` is unique, compelling, < ~160 chars, keyword-rich
- [ ] At least one contextual internal link in copy (beyond automatic related tools)
- [ ] FAQ added where it makes sense

## 5. Structured data

- [ ] View source → `WebApplication` JSON-LD present and accurate
- [ ] `BreadcrumbList` JSON-LD present
- [ ] `FAQPage` JSON-LD present if the page has FAQs
- [ ] Validate with the [Rich Results Test](https://search.google.com/test/rich-results)

## 6. Metadata / social

- [ ] Title renders as `Tool Name | OnlineUtilities`
- [ ] OG/Twitter card resolves (inherited `opengraph-image` or a tool-specific one)
- [ ] Twitter card type is `summary_large_image`

## 7. Responsiveness & cross-browser

- [ ] Mobile (~375px), tablet (~768px), desktop (~1280px) all look correct
- [ ] No horizontal scroll; tap targets ≥ 44px
- [ ] Verified in Chromium + Firefox + WebKit/Safari (at least one of each engine)
- [ ] Light **and** dark mode both verified

## 8. Performance (see [performance.md](./performance.md))

- [ ] Lighthouse (mobile, production build) — Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Heavy libraries `dynamic()`-loaded; no unexpected bundle growth
- [ ] No layout shift when output appears

> Lighthouse must be run against `npm run build && npm run start`, not `npm run dev`.

## 9. Deploy (Vercel)

- [ ] Merged to `main`; Vercel preview/production build green
- [ ] Required env vars set in Vercel (`NEXT_PUBLIC_SITE_URL`, any analytics)
- [ ] Smoke-test the live URL: page loads, tool works, sitemap includes it (`/sitemap.xml`)

## 10. Post-release (when applicable)

- [ ] Submit/refresh sitemap in Google Search Console
- [ ] Confirm the page is indexable (`robots` allows it; no `noindex`)
- [ ] Note the launch for analytics tracking
