# Design System

The visual language of OnlineUtilities and the rules for using it. Tokens are defined in [src/app/globals.css](../src/app/globals.css); primitives live in [src/components/ui/](../src/components/ui/). When in doubt, use a token and an existing primitive — don't invent new colors or one-off components.

> Some states below (**toast**, **error boundary**) are **not yet implemented**. They're marked _Recommended pattern_ so the first tool that needs them follows a consistent approach.

## Foundations

### Color (tokens, OKLCH)

Defined as CSS variables under `:root` and `.dark`, exposed to Tailwind via `@theme inline`. **Always use the semantic utility, never a raw hex** — that's what makes light/dark and re-theming automatic.

| Token                            | Utility examples                  | Use                                |
| -------------------------------- | --------------------------------- | ---------------------------------- |
| `background` / `foreground`      | `bg-background` `text-foreground` | Page surface and primary text      |
| `card` / `card-foreground`       | `bg-card`                         | Cards, raised surfaces             |
| `popover`                        | `bg-popover`                      | Menus, dropdowns                   |
| `primary` / `primary-foreground` | `bg-primary` `text-primary`       | Brand actions, links, active icon  |
| `secondary`                      | `bg-secondary`                    | Secondary buttons, badges          |
| `muted` / `muted-foreground`     | `text-muted-foreground`           | Secondary text, subtle backgrounds |
| `accent`                         | `hover:bg-accent`                 | Hover/active backgrounds           |
| `destructive`                    | `bg-destructive`                  | Errors, destructive actions        |
| `border` / `input` / `ring`      | `border` `ring-ring`              | Borders, field borders, focus ring |

- **Brand color** is an indigo/violet (`primary` ≈ `oklch(0.55 0.2 264)` light, lightened in dark). The logo mark uses `#4f46e5`.
- **Tints:** use opacity modifiers for soft fills — `bg-primary/10`, `border-primary/40`, `bg-muted/30`.

### Typography

- **Fonts:** Geist Sans (`--font-sans`) for UI/body, Geist Mono (`--font-mono`) for code/values. Loaded via `next/font` with `display: swap`.
- **Scale (Tailwind):** page H1 `text-3xl md:text-4xl` (hero `text-4xl md:text-6xl`); section H2 `text-2xl md:text-3xl`; card title `font-semibold`; body `text-base`; secondary `text-sm text-muted-foreground`; meta `text-xs`.
- Headings use `font-bold tracking-tight`. Use `text-balance` on hero/section headings for nicer wrapping.
- Exactly one H1 per page; never skip heading levels (SEO + a11y).

### Spacing & layout

- 4px spacing scale (Tailwind defaults).
- **Page container:** `container mx-auto px-4`.
- **Section rhythm:** vertical sections use `py-16` (hero `py-20 md:py-28`); alternating sections use `bg-muted/30 border-y`.
- **Card padding:** `p-5` (compact cards) or `p-6` (content cards). Grid gaps: `gap-4`.
- **Radius:** base `--radius: 0.75rem`. Cards `rounded-xl`, buttons/inputs `rounded-md`, pills/badges `rounded-full`, large CTAs `rounded-3xl`.
- **Elevation:** `shadow-sm` at rest, `hover:shadow-md` on interactive cards. Keep shadows soft.

### Responsive breakpoints

Tailwind defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.

- **Mobile-first:** style the base case, then add `sm:`/`md:`/`lg:` overrides.
- **Card grids** use this standard progression: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` (category grids stop at `lg:grid-cols-4`).
- Primary nav switches at `md` (`hidden md:flex` desktop nav; `MobileNav` is `md:hidden`).

### Dark mode rules

- Class-based: `.dark` on `<html>`, managed by `next-themes` (`attribute="class"`, light/dark/system).
- **You get dark mode for free if you only use tokens.** Never write `text-black`/`bg-white`/hex — use `text-foreground`/`bg-background`.
- `<html>` has `suppressHydrationWarning` (required by next-themes).
- Always sanity-check new UI in both themes (contrast can differ).

## Components

Import primitives from `@/components/ui/*`. They're built with CVA variants + `cn()`; extend via the `className` prop (tailwind-merge resolves conflicts).

### Buttons — `Button`

- **Variants:** `default` (primary), `secondary`, `outline`, `ghost`, `destructive`, `link`.
- **Sizes:** `default` (h-10), `sm` (h-9), `lg` (h-11), `icon` (square 40px).
- `asChild` renders a child (e.g. wrap a `<Link>`): `<Button asChild><Link …/></Button>`.
- Icons inside are auto-sized to `size-4`. Focus ring is built in.

### Badges — `Badge`

- **Variants:** `default` (primary tint), `secondary`, `outline`, `muted`.
- No `asChild` — to make a badge a link, wrap it: `<Link><Badge/></Link>`.

### Cards — `Card`

- `Card` + `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`.
- For clickable cards (like `ToolCard`/`CategoryCard`) the **whole card is one `<Link>`** for a large tap target; lift on hover (`hover:-translate-y-0.5 hover:shadow-md`).

### Form controls — `Input`

- `Input` is h-10, `rounded-md`, `border-input`, with built-in focus ring and `placeholder:text-muted-foreground`.
- **Always pair with a label** (`<label htmlFor>` or `aria-label`).
- For future selects/checkboxes/textareas, build shadcn-style primitives on Radix and keep the same token/variant conventions.

### Icons

- [lucide-react](https://lucide.dev/icons) only, for visual consistency.
- Data references icons by **string key** in the [icon registry](../src/lib/data/icons.ts); render dynamic icons with `<Icon name={key} />` ([icon.tsx](../src/components/shared/icon.tsx)). For fixed icons in a component, import the Lucide component directly.
- Default sizes: `size-4` inline/buttons, `size-5` in tiles, `size-7` page headers. Decorative icons get `aria-hidden`.

## States

### Empty state — `EmptyState`

[empty-state.tsx](../src/components/shared/empty-state.tsx). Dashed border, muted bg, centered icon + title + optional description + action. Used by search ("No tools found") and category pages. Reuse it for any "nothing here" UI.

### Loading state — `Skeleton` / `loading.tsx`

- `Skeleton` ([skeleton.tsx](../src/components/ui/skeleton.tsx)) = `animate-pulse` placeholder. Match the shape/size of the content it replaces to avoid layout shift.
- [app/loading.tsx](../src/app/loading.tsx) is the route-level fallback (skeleton grid).
- For in-tool async work, show a skeleton or a spinner inside a fixed-size container.

### Result / "copied" state

- Use `useCopyToClipboard` ([hook](../src/hooks/use-copy-to-clipboard.ts)) which exposes a transient `copied` flag — swap the copy icon for a check for ~2s.

### Error state — _Recommended pattern (not yet implemented)_

- **Inline validation errors:** render below the field in `text-destructive text-sm`, set `aria-invalid` on the input, link with `aria-describedby`. Validate with Zod.
- **Route errors:** add `app/error.tsx` (client component) for an error boundary, mirroring `not-found.tsx`'s layout (icon + message + recovery action). Add `app/global-error.tsx` only if needed.
- Never crash on bad input — guard and show a friendly message.

### Toast / notifications — _Recommended pattern (not yet implemented)_

- No toast system is installed. When the first tool needs ephemeral feedback (e.g. "Copied!", "Downloaded"), add a small shadcn-style toaster (Radix-based) under `components/ui/` rather than pulling a heavy library.
- Prefer **inline** feedback (the `copied` flag) over toasts where possible — it's simpler and more accessible.

## Adding to the design system

1. Reuse a token/primitive first. Only add a new token if a genuinely new semantic role exists (add to **both** `:root` and `.dark`, then `@theme inline`).
2. New primitives go in `components/ui/`, follow the CVA + `cn()` + `asChild` pattern, accept `className`, and stay accessible (labels, focus, keyboard).
3. Verify in light and dark, mobile and desktop, before committing.
