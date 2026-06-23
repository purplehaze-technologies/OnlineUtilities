# Adding a Tool

The architecture is designed so a new tool requires **two edits** plus the tool's own UI. Listing, search, category pages, related tools, breadcrumbs, SEO metadata, JSON-LD and `sitemap.xml` all update automatically because they derive from the data files.

This guide uses a concrete example: implementing the **QR Code Generator** (already present as a placeholder).

---

## Step 1 — Data entry

Tools live in [src/lib/data/tools.ts](../src/lib/data/tools.ts). Each entry is typed by `Tool` ([src/types/index.ts](../src/types/index.ts)):

```ts
{
  id: "qr-code-generator",        // unique, usually === slug
  name: "QR Code Generator",
  slug: "qr-code-generator",      // the URL segment under /tools
  description: "One SEO-friendly line — shown on cards and as meta description.",
  longDescription: "Optional longer copy shown on the tool's own page header.",
  category: "qr-barcode",         // must be a valid CategoryId (compile-checked)
  icon: "qrcode",                 // key in icons.ts
  keywords: ["qr", "wifi qr", "url to qr"],  // extra search terms
  featured: true,                 // surfaces in the homepage "Featured" grid
  comingSoon: false,              // false once the real UI exists
}
```

Notes:

- `category` is a `CategoryId` union — a typo is a TypeScript error, not a broken page. Valid ids are defined in `types/index.ts` and described in [categories.ts](../src/lib/data/categories.ts).
- `comingSoon: true` renders the polished `<ComingSoon />` placeholder. Flip to `false` when shipping the UI.

### Icon

The `icon` string is a key into the registry in [src/lib/data/icons.ts](../src/lib/data/icons.ts). If the key you want isn't there yet, import a [lucide-react](https://lucide.dev/icons) icon and add it:

```ts
import { QrCode } from "lucide-react";

export const iconRegistry = {
  // …
  qrcode: QrCode,
} as const satisfies Record<string, IconComponent>;
```

Render dynamic icons **only** via `<Icon name={tool.icon} />` ([src/components/shared/icon.tsx](../src/components/shared/icon.tsx)). Do not assign a component from `getIcon()` to a local and render it — the `react-hooks/static-components` ESLint rule will fail the build.

---

## Step 2 — The route

Every tool page is a thin wrapper. Copy any existing placeholder under `src/app/tools/<slug>/page.tsx`. The placeholder looks like this:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/lib/data/tools";
import { createMetadata } from "@/lib/seo";
import { ToolPageLayout } from "@/components/tool/tool-page-layout";
import { ComingSoon } from "@/components/tool/coming-soon";

const SLUG = "qr-code-generator";

export function generateMetadata(): Metadata {
  const tool = getToolBySlug(SLUG);
  if (!tool) return createMetadata({ path: `/tools/${SLUG}` });
  return createMetadata({
    title: tool.name,
    description: tool.description,
    path: `/tools/${tool.slug}`,
    keywords: tool.keywords,
  });
}

export default function Page() {
  const tool = getToolBySlug(SLUG);
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <ComingSoon toolName={tool.name} />
    </ToolPageLayout>
  );
}
```

To implement the tool, replace `<ComingSoon />` with the UI:

```tsx
export default function Page() {
  const tool = getToolBySlug(SLUG);
  if (!tool) notFound();

  return (
    <ToolPageLayout tool={tool}>
      <QrCodeGenerator /> {/* your client component */}
    </ToolPageLayout>
  );
}
```

`ToolPageLayout` ([src/components/tool/tool-page-layout.tsx](../src/components/tool/tool-page-layout.tsx)) already provides the breadcrumb, icon/title/description header, related-tools section and `WebApplication` JSON-LD. Keep the page itself thin.

---

## Step 3 — The tool's UI

- Put interactive UI in a **client component** (`"use client"`), e.g. `src/app/tools/qr-code-generator/qr-code-generator.tsx`, and import it into `page.tsx`. Keep `page.tsx` a Server Component so metadata stays static.
- Validate inputs with **Zod** — colocate schemas in [src/lib/schemas/](../src/lib/schemas/).
- Reuse primitives from `src/components/ui/` and hooks from `src/hooks/` (e.g. `useCopyToClipboard`).
- Prefer **client-side / in-browser** processing (privacy is a selling point). Pull heavy libraries via `dynamic()` import so they don't bloat the initial bundle.

---

## Step 4 — Verify

```bash
npm run typecheck && npm run lint && npm run build
```

All three must pass with zero warnings. Then visit:

- `/tools/<slug>` — the tool page
- `/tools` and `/` — the new card appears in listings/search
- `/categories/<category>` — appears under its category
- `/sitemap.xml` — the URL is included automatically

No other files need editing.
