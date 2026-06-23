# ADR-0006: Tailwind CSS v4 (CSS-first)

- **Status:** Accepted
- **Date:** 2026-06-23

## Context

We want a utility-first styling system with a token-based design language, dark mode, fast builds and minimal CSS output. Tailwind v4 changed the model: configuration is **CSS-first** (`@theme`, `@custom-variant`) rather than a JS `tailwind.config.ts`, with a faster engine.

## Decision

Use **Tailwind CSS v4**. Define design tokens as CSS variables in [`globals.css`](../../src/app/globals.css) (`:root` / `.dark`) and expose them to utilities via `@theme inline`. Drive dark mode with a `.dark` class via `@custom-variant`.

## Alternatives considered

- **Tailwind v3** — stable and familiar, but slower build, larger config surface, and we'd be adopting the soon-to-be-legacy model on a brand-new project.
- **CSS Modules / vanilla-extract** — more ceremony, no utility ergonomics, weaker design-token cohesion with the component variants.
- **A CSS-in-JS runtime** — runtime cost, conflicts with RSC/static-first goals.

## Consequences

- **Positive:** CSS-first tokens map cleanly to the shadcn-style components; fast builds; small output; OKLCH tokens give consistent light/dark; no JS theme config to maintain.
- **Negative / trade-offs:** v4 is newer with fewer SO answers; some v3 habits don't transfer. Notably, the `theme()` function in arbitrary values is gone — use `var(--token)` / `color-mix()` instead (a real footgun, documented in [CLAUDE.md](../../CLAUDE.md#gotchas-these-will-bite-you)).
- **Follow-ups:** there is intentionally **no `tailwind.config.ts`**; all theme changes happen in `globals.css`. New tokens go in both `:root` and `.dark`, then `@theme inline`.
