# Architecture Decision Records (ADRs)

Short, immutable records of significant architectural/design decisions: the **context**, the **decision**, the **alternatives** weighed, and the **consequences**. They exist so future contributors (human or AI) understand _why_ the project is the way it is and don't unknowingly reverse a deliberate choice.

## Conventions

- One decision per file: `NNNN-short-title.md` (zero-padded, sequential).
- ADRs are **append-only**: don't rewrite history. If a decision changes, add a new ADR and mark the old one `Superseded by ADR-XXXX`.
- Status: `Proposed` | `Accepted` | `Superseded` | `Deprecated`.
- Start from [template.md](./template.md).

## Index

| ADR                                        | Title                                               | Status   |
| ------------------------------------------ | --------------------------------------------------- | -------- |
| [0001](./0001-nextjs-app-router.md)        | Next.js (App Router) as the framework               | Accepted |
| [0002](./0002-data-driven-architecture.md) | Data-driven tool/category architecture              | Accepted |
| [0003](./0003-centralized-seo-metadata.md) | Centralized metadata & SEO helpers                  | Accepted |
| [0004](./0004-native-sitemap.md)           | Native sitemap/robots over `next-sitemap`           | Accepted |
| [0005](./0005-owned-shadcn-components.md)  | Own shadcn/ui components instead of a UI dependency | Accepted |
| [0006](./0006-tailwind-v4.md)              | Tailwind CSS v4 (CSS-first)                         | Accepted |
| [0007](./0007-track-latest-stable-next.md) | Track latest stable Next.js (16, not 15)            | Accepted |

Related: [../architecture.md](../architecture.md) summarizes the resulting architecture; ADRs hold the rationale.
