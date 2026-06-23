# Testing Strategy

> **Current state:** no automated test tooling is installed yet. Today the quality gate is **`typecheck` + `lint` + `build`** plus the manual QA checklist below. This document defines the philosophy and the recommended setup for when automated tests are added — follow it rather than inventing an ad-hoc approach.

## Philosophy

- **Type safety is the first line of defense.** Strict TypeScript + the typed data model (`CategoryId` union, `satisfies` on the icon registry) catch a whole class of errors at build time. Lean on it.
- **Test logic, not layout.** The highest-value tests are pure unit tests of the functions in `lib/` (search, formatting, validation, future tool algorithms). They're fast, stable and where real bugs live.
- **Don't test the framework or trivial markup.** No snapshot tests of static presentational JSX.
- **Accessibility and SEO are part of "correct."** They get their own verification passes.

## Recommended setup (when adding automated tests)

| Layer                   | Tool                               | Scope                                                               |
| ----------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| Unit                    | **Vitest**                         | Pure functions in `lib/` (search, slugify, tool logic, Zod schemas) |
| Component / interaction | **Vitest + React Testing Library** | Client components: `ToolSearch`, theme toggle, tool UIs             |
| Accessibility (unit)    | **jest-axe / vitest-axe**          | Assert no a11y violations on rendered components                    |
| E2E / smoke (optional)  | **Playwright**                     | Critical flows + cross-browser; can also drive Lighthouse/axe       |

Conventions when introduced:

- Co-locate as `*.test.ts(x)` next to the unit under test.
- Add `npm run test` (Vitest) and wire it into the pre-commit hook and CI alongside `typecheck`/`lint`.
- Keep tests deterministic and fast; mock `navigator.clipboard` etc.

### What to prioritize testing

1. **Tool algorithms** — the pure function that produces the tool's output (e.g. QR data string building, EMI math, case conversion). Cover representative + edge inputs.
2. **Zod schemas** — valid/invalid boundaries.
3. **Shared logic** — `searchTools`, `slugify`, `getRelatedTools`.
4. **Critical interactions** — input → output renders; copy action sets the `copied` flag.

## Accessibility testing

- **Automated:** axe (via the component-test layer) for violations.
- **Manual (required every release):**
  - Keyboard-only pass: tab order is logical, every action reachable, visible focus rings, no traps in menus/dialogs.
  - Screen-reader smoke test of one tool (NVDA/VoiceOver): labels read, dynamic output announced.
  - Check `aria-hidden` on decorative icons; labels on all inputs.
  - Verify contrast (WCAG AA) in light **and** dark mode.

## SEO verification

Per [seo-guide.md](./seo-guide.md):

- View source: title, meta description, canonical, OG/Twitter tags present and correct.
- JSON-LD present (`WebApplication`, `BreadcrumbList`, `FAQPage`) — validate in the [Rich Results Test](https://search.google.com/test/rich-results).
- Tool appears in `/sitemap.xml`; page is indexable.

## Lighthouse expectations

- Run on the **production build** (`npm run build && npm run start`), mobile preset.
- Targets: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100 (see [performance.md](./performance.md)).
- Treat a regression below target as a release blocker.

## Manual QA checklist (every tool, every release)

- [ ] Correct output for representative inputs
- [ ] Edge cases: empty, whitespace-only, very long, invalid, large files → graceful, no crash
- [ ] Copy / download / reset work
- [ ] Keyboard-only pass succeeds
- [ ] Light and dark mode both correct
- [ ] Mobile (~375px), tablet (~768px), desktop (~1280px) layouts correct; no horizontal scroll
- [ ] Verified across a Chromium, a Firefox, and a WebKit/Safari engine
- [ ] Lighthouse meets targets on the production build

See [release-checklist.md](./release-checklist.md) for the full pre-deploy gate.
