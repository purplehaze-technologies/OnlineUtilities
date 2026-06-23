# OnlineUtilities — Documentation

Reference docs for contributors and AI coding agents. **[../CLAUDE.md](../CLAUDE.md)** is the always-loaded summary; these files are the deep references you read on demand.

## Start here

- **[../CLAUDE.md](../CLAUDE.md)** — project context, commands, conventions and gotchas for AI agents.
- **[../README.md](../README.md)** — human-facing overview, setup and scripts.

## Building tools

- **[tool-template.md](./tool-template.md)** — fill this in before building any tool (decisions checklist).
- **[adding-a-tool.md](./adding-a-tool.md)** — the mechanical steps, with a worked example.
- **[release-checklist.md](./release-checklist.md)** — the pre-deploy gate every tool must pass.

## Guides

- **[architecture.md](./architecture.md)** — how the app is structured and why.
- **[design-system.md](./design-system.md)** — tokens, components, states, dark mode, responsive rules.
- **[component-conventions.md](./component-conventions.md)** — Server/Client, naming, composition, dynamic imports.
- **[seo-guide.md](./seo-guide.md)** — metadata, JSON-LD, internal linking, per-tool SEO checklist.
- **[performance.md](./performance.md)** — rendering strategy, bundles, Core Web Vitals targets.
- **[testing.md](./testing.md)** — testing philosophy, recommended setup, manual QA checklist.

## Decisions & direction

- **[adr/](./adr/)** — Architecture Decision Records (the durable "why").
- **[roadmap.md](./roadmap.md)** — planned tools, goals and exploratory ideas.

## Quick orientation

- **Source of truth:** [../src/lib/data/](../src/lib/data/) (`tools.ts`, `categories.ts`, `icons.ts`, `faqs.ts`).
- **Tool page shell:** [../src/components/tool/tool-page-layout.tsx](../src/components/tool/tool-page-layout.tsx).
- **SEO helpers:** [../src/lib/seo/](../src/lib/seo/) (`createMetadata`, JSON-LD builders).
- **Site config (one switch for domain/socials):** [../src/lib/constants/site.ts](../src/lib/constants/site.ts).

## The bar for any change

```bash
npm run typecheck && npm run lint && npm run build
```

All three pass with **zero warnings**.
