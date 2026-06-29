# Contributing to OnlineUtility

Thank you for considering a contribution. OnlineUtility is built by people who care about giving everyone access to great tools, for free. Every improvement — however small — makes a real difference.

This document explains how to contribute effectively. Please read it before opening a PR.

---

## Ways to Contribute

| Type                      | How                                                                  |
| ------------------------- | -------------------------------------------------------------------- |
| New tool                  | Follow the [Adding a New Utility](#adding-a-new-utility) guide below |
| Bug fix                   | Open an issue first for non-trivial bugs, then submit a PR           |
| Accessibility improvement | Always welcome; no issue required                                    |
| Performance improvement   | Benchmark before and after; include numbers in the PR                |
| Documentation             | Edit the relevant file in `docs/` and submit a PR                    |
| Design feedback           | Open a GitHub Discussion                                             |
| Feature request           | Open a GitHub Discussion or issue                                    |

---

## Local Setup

**Prerequisites:** Node.js 20+ and npm 10+.

```bash
git clone https://github.com/your-org/OnlineUtility.git
cd OnlineUtility
npm install
npm run dev   # http://localhost:3000
```

Verify your environment:

```bash
npm run typecheck   # must pass with 0 errors
npm run lint        # must pass with 0 warnings
npm run build       # must produce a clean production build
```

All three must stay green on every commit. A Husky pre-commit hook enforces `lint-staged` (ESLint + Prettier) and `tsc --noEmit`.

---

## Development Workflow

1. **Fork** the repository and create your branch from `main`.
2. Make your changes.
3. Ensure `typecheck`, `lint`, and `build` all pass.
4. Open a pull request against `main`.

For larger changes, open an issue or Discussion first to align on the approach before investing time in implementation.

---

## Branch Naming

```
feat/slug-generator-tool
fix/qr-code-color-reset
docs/update-adding-a-tool
chore/upgrade-lucide
a11y/focus-ring-header-nav
```

Use lowercase kebab-case. Prefix with the type:

| Prefix      | Use for                                     |
| ----------- | ------------------------------------------- |
| `feat/`     | New tools or features                       |
| `fix/`      | Bug fixes                                   |
| `docs/`     | Documentation only                          |
| `chore/`    | Dependency updates, build changes           |
| `a11y/`     | Accessibility-only changes                  |
| `perf/`     | Performance improvements                    |
| `refactor/` | Code restructuring with no behaviour change |

---

## Commit Message Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(tools): add slug generator tool
fix(qr): reset colour on format change
docs(contributing): clarify branch naming
chore(deps): upgrade lucide-react to 1.22.0
a11y(nav): add missing aria-label to mobile menu
```

- **Present tense, imperative mood**: "add", not "added" or "adds"
- **Lowercase subject line**
- **No full stop at the end**
- **Keep the subject line under 72 characters**
- Add a body for non-obvious context

---

## Pull Request Checklist

Before requesting a review, confirm:

- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 warnings
- [ ] `npm run build` completes cleanly
- [ ] New tool has `comingSoon: false` only when the UI is fully implemented
- [ ] All interactive elements are keyboard-accessible
- [ ] All form controls have visible labels
- [ ] The tool works on mobile and desktop
- [ ] No personal data is sent to any server unless absolutely necessary and disclosed
- [ ] New dependencies are justified in the PR description
- [ ] The PR description explains the _why_, not just the _what_

---

## Coding Standards

### General

- **Server Components by default.** Add `"use client"` only when you need interactivity (event handlers, browser APIs, state).
- **TypeScript strict mode** is enforced. No `any`, no `// @ts-ignore` without a documented reason.
- Logic belongs in `src/lib/`, custom hooks in `src/hooks/`, Zod schemas in `src/lib/schemas/`. Keep page and component files thin.
- Use `cn()` from `src/lib/utils/` for conditional class names.

### Styling

- Style exclusively with Tailwind utilities. No inline styles, no CSS modules, no styled-components.
- Use design token utilities (`bg-background`, `text-muted-foreground`, `border-primary/40`) rather than raw colour values.
- Tailwind v4 is CSS-first: tokens are defined in `src/app/globals.css` under `:root` / `.dark`. There is no `tailwind.config.ts`.
- For dynamic values, use `var(--token-name)` or `color-mix()`. Do not use deprecated `theme()` function syntax.

### Components

- Never write `const Icon = getIcon(x)` then `<Icon />` — the lint rule `react-hooks/static-components` will fail the build. Use `<Icon name={x} className="…" />` from `src/components/shared/icon.tsx`.
- `Badge` has no `asChild` prop — wrap it in a `<Link>` instead of passing `asChild`.
- Do not use `next-sitemap` or hand-roll `Metadata` objects. Use `createMetadata()` from `src/lib/seo/metadata.ts`.
- Route `params` is a `Promise` in Next 16 — always `await` it in pages and `generateMetadata`.

### Comments

- Write no comments by default. Only add one when the _why_ is non-obvious: a hidden constraint, a subtle invariant, or a workaround for a known bug.
- Never describe _what_ the code does — well-named identifiers already do that.

---

## Accessibility Guidelines

Every contribution must meet **WCAG 2.1 Level AA** as a minimum:

- All interactive elements are reachable and operable via keyboard
- Visible focus indicators are never removed (only styled)
- All images have meaningful `alt` text or `alt=""` if decorative
- Form controls have associated `<label>` elements (via `htmlFor` or `aria-labelledby`)
- Colour contrast meets 4.5:1 for normal text, 3:1 for large text and UI components
- Do not rely on colour alone to convey information
- Prefer semantic HTML (`<button>`, `<nav>`, `<main>`, `<section>`) over `<div>` + ARIA

Radix UI primitives handle many accessibility concerns automatically. Build on them rather than replacing them.

---

## Performance Expectations

- Tools must be **interactive within 1 second** on a mid-range mobile device on a 4G connection
- Avoid importing large third-party libraries when the same result is achievable with a few lines of code
- New dependencies must appear in the PR description with a justification and a size note (use [Bundlephobia](https://bundlephobia.com))
- Lazy-load heavy libraries (e.g., PDF engines, image processors) with dynamic `import()`
- Do not block the main thread with synchronous computation on large inputs

---

## Testing Requirements

- There is currently no automated test suite. This is a known gap and is on the [roadmap](ROADMAP.md).
- Until tests exist, manually verify your changes in Chrome, Firefox, and Safari (or Chromium-based equivalents) before submitting.
- Test on a real mobile device or using browser DevTools device emulation.
- Test in both light and dark mode.

---

## Documentation Requirements

- New tools must be reflected in the `src/lib/data/tools.ts` entry. No additional documentation is required for straightforward tools.
- If a new tool introduces a pattern not covered by existing docs, update or extend the relevant file in `docs/`.
- Update `CHANGELOG.md` under the `[Unreleased]` section following the [Keep a Changelog](https://keepachangelog.com) format.

---

## Adding a New Utility

See [docs/adding-a-tool.md](docs/adding-a-tool.md) for the full worked example. In brief:

### Step 1 — Register the tool

Add an entry to `src/lib/data/tools.ts`:

```ts
{
  id: "your-tool-id",
  name: "Your Tool Name",
  slug: "your-tool-slug",
  description: "One sentence, under 160 characters, no trailing period.",
  longDescription: "Two to three sentences for the tool page header.",
  category: "developer",        // must be a valid CategoryId
  icon: "your-icon-key",        // register the icon in icons.ts
  keywords: ["keyword1", "keyword2"],
  featured: false,
  comingSoon: true,             // set to false once UI is complete
}
```

Register the icon in `src/lib/data/icons.ts` by mapping the key to a Lucide component.

### Step 2 — Create the page

Copy any existing placeholder page:

```
src/app/tools/<slug>/page.tsx
```

Wrap your UI in `<ToolPageLayout tool={tool}>`. Use `<ToolWorkbench>`, `<ToolPanel>`, `<ToolField>`, and `<CopyButton>` from `src/components/tool/` to maintain visual consistency.

For the tool schema, create `src/lib/schemas/<slug>.ts` and use Zod to validate inputs.

Set `comingSoon: false` in `tools.ts` once the implementation is complete and all checklist items pass.

---

## Code Review Expectations

- Reviews aim to complete within **3 business days**.
- Reviewers will focus on correctness, accessibility, privacy, and maintainability — not stylistic preferences outside the established conventions.
- Requested changes are expected to be addressed within **7 days**. PRs with no activity after 14 days may be closed; you are welcome to reopen.
- Be constructive and specific in review comments. If you request a change, explain why.

---

## Community Behaviour

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md). In short: be kind, be patient, be constructive.

Questions, ideas, and discussion belong in [GitHub Discussions](https://github.com/your-org/OnlineUtility/discussions). Bugs and actionable improvements belong in [issues](https://github.com/your-org/OnlineUtility/issues).
