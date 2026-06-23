# ADR-0005: Own shadcn/ui components instead of a UI dependency

- **Status:** Accepted
- **Date:** 2026-06-23

## Context

We need accessible, themeable UI primitives (button, input, card, badge, dropdown, accordion, …) that match a custom design system and stay light. The PRD calls for shadcn/ui. shadcn/ui is not a runtime package — it's a pattern: you copy component source into your repo and own it.

## Decision

**Hand-author shadcn/ui-style components** in [`src/components/ui/`](../../src/components/ui/), built on Radix primitives with CVA variants + `cn()`. We own the code; there is no shadcn CLI step in this project.

## Alternatives considered

- **A full component-library dependency (MUI, Chakra, etc.)** — large runtime, opinionated styling that fights a custom Tailwind design system, harder to reach Lighthouse targets.
- **shadcn CLI `init`/`add`** — the normal shadcn workflow; skipped here because the interactive CLI is flaky in this environment and hand-authoring yields identical, fully-owned output with the exact tokens we want.
- **Headless-only (Radix) with no styling layer** — we still want a consistent variant system; CVA + tokens provides it.

## Consequences

- **Positive:** no runtime UI dependency; full control over markup, variants and a11y; components use our OKLCH token system so light/dark and re-theming are automatic; Radix gives accessibility for the interactive bits.
- **Negative / trade-offs:** we maintain the components ourselves and don't get automatic upstream updates; new primitives are a manual (but small) effort.
- **Follow-ups:** new primitives follow the same pattern (CVA + `cn()` + `asChild` where useful, `className` passthrough, tokens, keyboard/focus). See [../design-system.md](../design-system.md) and [../component-conventions.md](../component-conventions.md).
