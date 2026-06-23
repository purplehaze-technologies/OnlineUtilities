# Component Conventions

Rules for writing components in OnlineUtilities. The layering ("what lives where") is in [architecture.md](./architecture.md#component-layers); this doc is about **how to write a component** day to day.

## Server vs Client Components

**Default to Server Components.** Add `"use client"` only when the component needs one of: state/effects (`useState`/`useEffect`), event handlers, browser APIs (`window`, `navigator`, `localStorage`), or a client-only library.

Currently client: `tool-search`, `theme-toggle`, `mobile-nav`, `accordion`, `dropdown-menu`, `theme-provider`, `use-copy-to-clipboard`. Everything else is a Server Component.

**Keep the client boundary small and deep.** A tool **page** stays a Server Component (so `generateMetadata` is static); the interactive part is a nested client component imported into it:

```
app/tools/<slug>/page.tsx          ← Server Component (metadata + layout)
app/tools/<slug>/<slug>-client.tsx ← "use client" (the interactive UI)
```

Anti-patterns:

- Don't put `"use client"` at the top of a page/layout just to use one interactive widget — wrap the widget instead.
- Don't pass non-serializable props (functions, class instances) from Server → Client.
- A Client Component can't import a Server Component as a child by reference, but it **can** receive one via `children`/props.

## File & naming conventions

- **Files:** `kebab-case.tsx` (`tool-card.tsx`, `site-header.tsx`).
- **Components:** `PascalCase` (`ToolCard`, `SiteHeader`).
- **Hooks:** `use-*.ts` exporting `useThing` (`use-copy-to-clipboard.ts`).
- **Data/util/seo modules:** `kebab-case.ts`; helpers `camelCase`.
- One primary component per file (small sub-parts like `CardHeader` may share a file).
- Co-locate a tool's client component beside its `page.tsx`; promote to `components/tool/` only when reused.

## Size guidelines

- If a component exceeds ~150 lines or mixes several concerns, split it. The homepage composes many small sections rather than one giant file.
- Extract a sub-component when markup is **repeated** or independently meaningful — not preemptively. Repetition first, abstraction second.
- Keep JSX shallow; lift complex logic into `lib/` (pure functions) or hooks.

## Reusability rules

- **Generic UI** → `components/ui/` (no app/domain knowledge; configured purely by props).
- **Domain pieces** (know about tools/categories) → `components/tool/`.
- **Cross-cutting helpers** (icon, json-ld, empty-state, page-shell) → `components/shared/`.
- Don't hardcode tool/category content in a component — read from `lib/data`.
- Before writing a new component, check `components/ui` and `components/shared` for something to reuse or extend.

## Composition patterns

- **`asChild` (Slot):** for polymorphic elements, e.g. a button that's actually a link: `<Button asChild><Link href>…</Link></Button>`. Supported by `Button`; **not** `Badge` (wrap a `<Link>` around it instead).
- **`className` passthrough:** every primitive accepts `className` and merges it with `cn()` (tailwind-merge wins conflicts). Style by passing classes, not by forking the component.
- **`children` over config:** prefer composing children (e.g. `ToolPageLayout` wraps arbitrary tool UI) rather than boolean prop explosions.
- **Variants via CVA:** when a component has discrete visual modes, model them as CVA `variants` (see `button.tsx`, `badge.tsx`) instead of ad-hoc conditional classes.
- **Layout shells:** reuse `ToolPageLayout` (tool pages) and `PageShell` (content/legal pages) instead of re-implementing breadcrumb + header.

## Shared UI usage

- Build forms from `Input` (+ future Radix-based controls), not raw elements, so focus/disabled/dark styles are consistent.
- Use `EmptyState`, `Skeleton`, `Badge`, `Card` rather than re-creating those visuals.
- Dynamic icons: `<Icon name={key} />`. Fixed icons: import the Lucide component directly. **Never** `const X = getIcon(...)` then `<X/>` (fails the `react-hooks/static-components` lint rule — see [CLAUDE.md gotchas](../CLAUDE.md#gotchas-these-will-bite-you)).

## Dynamic imports

Use `next/dynamic` for heavy or below-the-fold client components and large tool libraries, so they don't bloat the initial bundle:

```tsx
import dynamic from "next/dynamic";

// Heavy client widget — only loaded when this page renders it.
const QrCanvas = dynamic(() => import("./qr-canvas"), {
  loading: () => <Skeleton className="aspect-square w-full" />,
});
```

Guidelines:

- Reserve space with a sized `loading` skeleton to avoid CLS.
- `ssr: false` only when the component truly can't render on the server (e.g. needs `canvas`/`window`); otherwise keep SSR for SEO.
- Don't dynamic-import tiny components — the overhead isn't worth it. See [performance.md](./performance.md).

## Accessibility (non-negotiable)

- Semantic elements first (`<nav>`, `<main>`, `<button>`, `<a>`); ARIA only to fill gaps.
- Labels on every control; `aria-hidden` on decorative icons; `aria-live` for dynamic output.
- Keyboard support and visible focus rings (inherited from tokens) must work.
- See [design-system.md](./design-system.md) for state patterns and [testing.md](./testing.md) for the a11y QA pass.
