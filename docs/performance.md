# Performance Guide

Performance is a ranking and UX priority. This guide is the practical playbook; the rendering rationale is in [architecture.md](./architecture.md#rendering-model).

## Targets

| Metric                    | Target  |
| ------------------------- | ------- |
| Lighthouse Performance    | ≥ 95    |
| Lighthouse Accessibility  | 100     |
| Lighthouse Best Practices | 100     |
| Lighthouse SEO            | 100     |
| LCP                       | < 2.5s  |
| CLS                       | < 0.1   |
| INP                       | < 200ms |

Measure against a **production build** (`npm run build && npm run start`), mobile preset, not `npm run dev`.

## Rendering strategy

- **Static-first.** Pages are Server Components and prerender to static HTML/SSG (`○`/`●` in build output). This is the single biggest lever — keep it that way. A route slipping to `ƒ Dynamic` should be deliberate.
- Don't introduce request-time work (uncached `fetch`, `cookies()`, `headers()`) on tool pages — they should stay static.
- Keep data in-memory (the `lib/data` files); no DB/network for listing, search, or rendering.

## Avoid unnecessary Client Components

The most common perf regression is shipping JS that didn't need to. Before adding `"use client"`, confirm it's truly interactive (see [component-conventions.md](./component-conventions.md#server-vs-client-components)). Push the boundary as deep as possible so the static shell stays JS-light.

## Bundle optimization

- **No gratuitous dependencies.** Default to zero. Justify every addition; prefer the platform (Web APIs) and small libraries.
- `lucide-react` is tree-shaken via `optimizePackageImports` (in `next.config.ts`) + the icon registry — import icons by name, never `import * as Icons`.
- Watch bundle size in the build output; investigate unexpected growth when adding a tool.

## Dynamic imports & lazy loading

- Load heavy tool libraries (QR/barcode renderers, parsers, image processors) with `next/dynamic` so they're fetched only on the page that uses them.
- Use `ssr: false` **only** when the component can't render server-side (needs `canvas`/`window`); otherwise keep SSR for SEO.
- Lazy-load below-the-fold heavy widgets; always provide a sized `loading` skeleton to prevent layout shift.
- Don't dynamic-import trivial components — the request overhead outweighs the savings.

## Image optimization

- Use `next/image` for content images: automatic responsive `srcset`, lazy-loading, and modern formats.
- Always set `width`/`height` (or `fill` + a sized parent) to reserve space → protects CLS.
- Meaningful `alt` (or `alt="" aria-hidden` for decorative). Prefer SVG for icons/logos.
- Above-the-fold hero images: add `priority`.

## Font loading

- Fonts load via `next/font` (Geist Sans/Mono) with `display: swap` and are self-hosted — no render-blocking external request, no FOIT. Subset to `latin`. Don't add webfonts via `<link>`.

## Memoization guidelines

- Don't reach for `useMemo`/`useCallback` by default — they have a cost and most renders are cheap.
- **Do** memoize: expensive pure computations (e.g. parsing/formatting large input) and derived lists feeding big subtrees. `ToolSearch` uses `useMemo` for filtered results + `useDeferredValue` to keep typing responsive — follow that pattern for live, compute-on-type tools.
- Stabilize callbacks with `useCallback` only when passed to memoized children or effect deps (as in `use-copy-to-clipboard`).
- Profile before optimizing; remove memoization that doesn't measurably help.

## Layout stability (CLS)

- Reserve space for anything async: skeletons that match final size, fixed-height/aspect-ratio output containers.
- Avoid injecting content above existing content after load.
- The header is `sticky` with a fixed height (`h-16`) — keep it stable.

## Interactivity (INP)

- Keep client components small; avoid heavy synchronous work in event handlers (debounce/defer, or move to a worker for very heavy parsing).
- `useDeferredValue` for type-to-filter UIs keeps input latency low.

## Network & headers

- `next.config.ts` sets `compress`, strips `x-powered-by`, and adds security headers. Static assets are served with long-lived caching by Vercel.

## Performance checklist (per change)

- [ ] New route is `○ Static` / `●  SSG` in the build output
- [ ] No new `"use client"` that could be a Server Component
- [ ] Heavy libs `dynamic()`-loaded; bundle didn't grow unexpectedly
- [ ] Images via `next/image` with reserved dimensions
- [ ] No layout shift when results/output appear
- [ ] Lighthouse on the production build meets the targets above
