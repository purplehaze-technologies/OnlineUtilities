# Tool Specification Template

Copy this template into a short spec (or PR description / issue) before building any new tool. It forces the decisions that matter for SEO, accessibility and performance _before_ code is written. Pair it with the mechanical steps in [adding-a-tool.md](./adding-a-tool.md).

> Keep the filled-in spec short. The point is to make intentional choices, not to write an essay.

---

## `<Tool Name>` — Specification

### 1. Purpose

- **One-line description** (this becomes `description` in `tools.ts` and the meta description): _…_
- **Who it's for / job to be done:** _…_
- **Category** (`CategoryId`): _… (qr-barcode | developer | text | seo | image | calculators | converters | utilities)_

### 2. Features

- Core: _… (the minimum that makes it useful)_
- Nice-to-have (defer if needed): _…_
- Explicitly **out of scope** for v1: _…_

### 3. Inputs & validation

- Inputs: _… (fields, types, ranges)_
- Validation rules → **Zod schema** in `src/lib/schemas/<slug>.ts`: _…_
- Error/edge cases to handle: _… (empty, too-long, invalid format, huge files)_

### 4. Processing & dependencies

- **Where does work happen?** Prefer **in-browser** (privacy is a selling point). Note any server need: _…_
- New dependencies (justify each; default is none): _…_
- Heavy libraries must be loaded with `dynamic()` / `next/dynamic`. List them: _…_

### 5. UI requirements

- Layout sketch (inputs left/top, output right/bottom is the default): _…_
- Reused primitives from `src/components/ui/`: _… (Button, Input, Card, …)_
- States to design: **empty**, **loading**, **result**, **error**, **copied** (see [design-system.md](./design-system.md)).
- Output actions: copy / download / reset — use `useCopyToClipboard`.

### 6. Accessibility

- All inputs have associated `<label>`s.
- Output updates announced (`aria-live` where appropriate).
- Fully keyboard-operable; visible focus rings (inherited).
- Color is never the only signal. Confirm WCAG AA contrast.

### 7. SEO

Follow [seo-guide.md](./seo-guide.md). Confirm:

- `tools.ts` entry has a keyword-rich `name`, `description`, `longDescription`, and `keywords[]`.
- `generateMetadata` uses `createMetadata({ title, description, path, keywords })`.
- H1 = tool name (provided by `ToolPageLayout`); meaningful H2s for sections.
- Internal links: related tools (automatic) + at least one in-copy contextual link where natural.

### 8. Structured data (JSON-LD)

- `WebApplication` JSON-LD is emitted automatically by `ToolPageLayout` — verify the description reads well.
- If the page has FAQs, render `<FaqSection>` (emits `FAQPage`).
- `BreadcrumbList` is automatic via `<Breadcrumb>`.

### 9. FAQ content (recommended for SEO)

Write 3–6 Q&As specific to this tool (define them in the page or a colocated data file and pass to `<FaqSection withJsonLd>`): _…_

### 10. Related tools

- Automatic: same-category tools via `getRelatedTools`. Confirm the category grouping makes the suggestions relevant; if not, reconsider the `category`.

### 11. Performance

- Targets per [performance.md](./performance.md): LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Keep the page a Server Component; isolate interactivity in a nested `"use client"` component.
- No layout shift: reserve space for outputs.
- Confirm no large dependency ships to the client unless `dynamic()`-loaded.

### 12. Testing & QA

- Manual QA per [testing.md](./testing.md): correctness on representative + edge inputs, keyboard pass, mobile pass.
- If logic is non-trivial, add pure unit tests for the `lib/` function (see testing.md for the recommended setup).

### 13. Release

- Run the full [release-checklist.md](./release-checklist.md).
- Flip `comingSoon: false` in `tools.ts` **only when the UI is real and the checklist passes**.

---

### Definition of done

- [ ] Spec above filled in and decisions made
- [ ] `tools.ts` + icon registry updated
- [ ] Page + nested client UI implemented; tiny `page.tsx`
- [ ] Zod validation for inputs
- [ ] Empty / loading / result / error / copied states handled
- [ ] FAQ written (if applicable)
- [ ] `npm run typecheck && npm run lint && npm run build` green
- [ ] [release-checklist.md](./release-checklist.md) complete
- [ ] `comingSoon: false`
