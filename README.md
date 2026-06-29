# OnlineUtility

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-org/OnlineUtility/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> **The Open Source Home for Free Online Tools.**

A fast, privacy-first, SEO-optimised collection of browser-based utilities — free forever, no sign-up required.

---

## Overview

OnlineUtility gives everyone access to high-quality tools that run entirely in the browser. No data leaves your machine unless a tool explicitly requires it. The architecture is designed to scale from the current 20+ tools to hundreds with no structural changes — almost everything is derived from a small set of data files.

---

## Features

- **20+ tools** across Developer, Text, Image, Calculators, SEO, QR & Barcode, and Utilities categories
- **Privacy-first** — most tools never send data to any server
- **Instant** — no loading spinners, no accounts, no ads
- **Accessible** — WCAG AA compliant; full keyboard navigation
- **SEO-optimised** — server-rendered pages, structured data, sitemap, Open Graph
- **Dark mode** — system preference respected, toggle available
- **Responsive** — works on every screen size
- **Data-driven** — adding a tool is a two-step, zero-config process
- **Production build always green** — typecheck + lint enforced on every commit

---

## Screenshots

> _Screenshots coming soon._

---

## Live Demo

🌐 **[onlineutility.io](https://onlineutility.io)**

---

## Tech Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 16 (App Router, RSC, Turbopack)           |
| UI Library | React 19                                          |
| Language   | TypeScript 5 (strict mode)                        |
| Styling    | Tailwind CSS v4 (CSS-first, no config file)       |
| Components | Radix UI primitives (hand-authored, shadcn-style) |
| Icons      | Lucide React                                      |
| Validation | Zod 4                                             |
| Analytics  | Vercel Analytics + Speed Insights                 |
| Hosting    | Vercel                                            |

---

## Installation

**Prerequisites:** Node.js 20+ and npm 10+.

```bash
git clone https://github.com/your-org/OnlineUtility.git
cd OnlineUtility
npm install
```

---

## Running Locally

```bash
npm run dev        # dev server at http://localhost:3000 (Turbopack)
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint (0 warnings required)
npm run format     # Prettier write
```

A pre-commit hook (`husky` + `lint-staged`) runs `eslint --fix`, `prettier --write`, and `tsc --noEmit` automatically on every commit.

---

## Environment Variables

| Variable               | Required | Description                                                                   |
| ---------------------- | -------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Canonical site URL. Falls back to `VERCEL_URL`, then `http://localhost:3000`. |

No other environment variables are needed for local development.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router routes
│   ├── (marketing)/        # Homepage, /tools listing, /categories/[category]
│   ├── tools/[slug]/       # Individual tool pages
│   ├── sitemap.ts          # Auto-generated sitemap
│   ├── robots.ts           # robots.txt
│   └── opengraph-image.tsx # Edge OG image
├── components/
│   ├── ui/                 # Base primitives (Button, Input, Badge…)
│   ├── layout/             # Header, Footer, Nav, Breadcrumb, ThemeToggle
│   ├── tool/               # ToolCard, ToolSearch, ToolPageLayout, ToolWorkbench…
│   └── shared/             # Icon, JsonLd, FaqSection, PageShell, SectionHeading
├── lib/
│   ├── data/               # ← single source of truth (tools.ts, categories.ts…)
│   ├── seo/                # createMetadata(), JSON-LD builders
│   ├── constants/          # siteConfig (name, URL, socials)
│   ├── schemas/            # Per-tool Zod schemas
│   └── utils/              # cn(), formatters
├── hooks/                  # Custom React hooks
└── types/                  # Tool, Category, CategoryId types
```

---

## Available Scripts

| Script                 | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start dev server with Turbopack  |
| `npm run build`        | Production build                 |
| `npm run start`        | Serve production build           |
| `npm run typecheck`    | TypeScript strict check          |
| `npm run lint`         | ESLint (must produce 0 warnings) |
| `npm run lint:fix`     | ESLint with auto-fix             |
| `npm run format`       | Prettier write                   |
| `npm run format:check` | Prettier check                   |

---

## Adding a New Tool

Full guide: [docs/adding-a-tool.md](docs/adding-a-tool.md). Short version:

1. Add an entry to [`src/lib/data/tools.ts`](src/lib/data/tools.ts) and register an icon key in [`src/lib/data/icons.ts`](src/lib/data/icons.ts).
2. Create `src/app/tools/<slug>/page.tsx` by copying an existing placeholder. Place your UI inside `<ToolPageLayout tool={tool}>`.
3. Set `comingSoon: false` once the implementation is complete.

Listing pages, search, SEO metadata, breadcrumbs, related tools, and `sitemap.xml` all update automatically.

---

## Contributing

We welcome contributions of all kinds — new tools, bug fixes, accessibility improvements, documentation, and more.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR. It covers branch naming, commit conventions, the PR checklist, coding standards, and accessibility requirements.

---

## Documentation

| Document                                                       | Description                                   |
| -------------------------------------------------------------- | --------------------------------------------- |
| [docs/adding-a-tool.md](docs/adding-a-tool.md)                 | Step-by-step: building a new utility          |
| [docs/tool-template.md](docs/tool-template.md)                 | Boilerplate template for new tools            |
| [docs/architecture.md](docs/architecture.md)                   | How and why things are built the way they are |
| [docs/design-system.md](docs/design-system.md)                 | Design tokens, components, CSS conventions    |
| [docs/component-conventions.md](docs/component-conventions.md) | Component authoring rules                     |
| [docs/seo-guide.md](docs/seo-guide.md)                         | SEO, metadata, and JSON-LD patterns           |
| [docs/performance.md](docs/performance.md)                     | Performance budgets and guidelines            |
| [docs/release-checklist.md](docs/release-checklist.md)         | Pre-release checklist                         |
| [ROADMAP.md](ROADMAP.md)                                       | Planned features and future ideas             |
| [CHANGELOG.md](CHANGELOG.md)                                   | Release history                               |

---

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the full plan. Near-term priorities: completing tool implementations, adding image and PDF tools, and establishing a testing baseline.

---

## Security

To report a security vulnerability, follow the process in [SECURITY.md](SECURITY.md). **Do not open a public issue for security bugs.**

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for the full text.

---

## Acknowledgements

- [Next.js](https://nextjs.org) by Vercel
- [Radix UI](https://radix-ui.com) for accessible primitives
- [Lucide](https://lucide.dev) for icons
- [shadcn/ui](https://ui.shadcn.com) for the component architecture inspiration
- Every contributor who has opened a PR or filed an issue

---

## Support the Project

If OnlineUtility saves you time, consider:

- ⭐ **Starring the repository** — helps others discover the project
- 🐛 **Reporting bugs** — open a [GitHub issue](https://github.com/your-org/OnlineUtility/issues)
- 💡 **Suggesting tools** — start a [GitHub Discussion](https://github.com/your-org/OnlineUtility/discussions)
- 🛠️ **Contributing code** — read [CONTRIBUTING.md](CONTRIBUTING.md) and open a PR

---

[![Star on GitHub](https://img.shields.io/github/stars/your-org/OnlineUtility?style=social)](https://github.com/your-org/OnlineUtility)

If this project is useful to you, a ⭐ on GitHub is the best way to show it and help others find it.
