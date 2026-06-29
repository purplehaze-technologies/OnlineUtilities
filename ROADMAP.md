# Roadmap

This is a living document. It reflects the current state and direction of OnlineUtility. Priorities can shift based on contributor interest and community feedback.

Have an idea? [Open a Discussion](https://github.com/your-org/OnlineUtility/discussions).

---

## Completed

### Foundation

- [x] Next.js 16 App Router + React 19 + TypeScript strict project setup
- [x] Tailwind CSS v4 (CSS-first) design system with dark mode
- [x] Radix UI component primitives (Button, Input, Badge, Accordion, Dropdown)
- [x] Data-driven architecture (`tools.ts`, `categories.ts`) — adding a tool is 2 steps
- [x] Homepage with featured tools, category sections, and FAQ
- [x] `/tools` listing page with search and category filter
- [x] `/categories/[category]` pages
- [x] Individual tool page layout (`ToolPageLayout`, `ToolWorkbench`, `ToolPanel`)
- [x] SEO infrastructure: `createMetadata()`, JSON-LD builders, OG images, sitemap, robots
- [x] `siteConfig` single-source for site name / URL / socials
- [x] Vercel Analytics + Speed Insights integration
- [x] Husky pre-commit hook (lint-staged + typecheck)
- [x] `CopyButton`, `ToolField`, shared `Icon` component

### Tools Implemented

- [x] QR Code Generator (URL, text, Wi-Fi, contact; custom colours; PNG/SVG download)
- [x] Barcode Generator (EAN, UPC, Code128, Code39)
- [x] Password Generator (length, charset, copy)
- [x] UUID Generator (v4, bulk)
- [x] JSON Formatter (beautify, minify, validate)
- [x] JWT Decoder (header + payload inspection, no data leaves the browser)
- [x] Base64 Encoder / Decoder (text and file)
- [x] Image to Base64 (data URI output)
- [x] Color Picker (HEX, RGB, HSL, OKLCH conversion)
- [x] Age Calculator (exact age in years, months, weeks, days)
- [x] GST Calculator (add / remove tax)
- [x] SIP Calculator (compounding mutual fund returns)
- [x] EMI Calculator (loan amortisation)
- [x] Word Counter (words, characters, sentences, reading time)
- [x] Case Converter (upper, lower, title, camel, snake, kebab)
- [x] Markdown Previewer (live side-by-side)
- [x] Meta Tag Generator (SEO, Open Graph, Twitter Card)
- [x] Sitemap Generator (XML from URL list)
- [x] Schema Generator (JSON-LD structured data)
- [x] Slug Generator (URL-friendly slugs)

---

## In Progress

- [ ] Tool implementation quality audit — verify every tool is fully functional, not just a placeholder
- [ ] Accessibility audit across all tool pages (keyboard nav, focus rings, ARIA)
- [ ] Mobile layout review for all tools
- [ ] Performance baseline — Core Web Vitals measurement per tool page

---

## Planned

### New Tools

#### Developer Tools

- [ ] URL Encoder / Decoder
- [ ] Hash Generator (MD5, SHA-1, SHA-256, SHA-512)
- [ ] Cron Expression Builder (visual cron editor with human-readable output)
- [ ] Regex Tester (live match highlighting, flags, capture groups)
- [ ] HTML Entity Encoder / Decoder
- [ ] CSS Minifier / Beautifier
- [ ] SQL Formatter (multiple dialects)
- [ ] Diff Viewer (text comparison)
- [ ] Number Base Converter (decimal, binary, hex, octal)
- [ ] Unix Timestamp Converter

#### Text Tools

- [ ] Lorem Ipsum Generator (paragraphs, sentences, words)
- [ ] Text Deduplicator (remove duplicate lines)
- [ ] Text Sorter (alphabetical, reverse, random)
- [ ] Text Encryptor (AES-256, browser-side)
- [ ] Palindrome Checker
- [ ] String Escape / Unescape (JSON, HTML, URL)
- [ ] Reading Level Analyser (Flesch-Kincaid, Gunning Fog)

#### Image Tools

- [ ] Image Resizer (browser-side, Canvas API)
- [ ] Image Compressor (browser-side, quality slider)
- [ ] Image Format Converter (JPEG, PNG, WebP)
- [ ] SVG Optimiser (SVGO-equivalent, client-side)
- [ ] Favicon Generator (multi-size ICO / PNG set)
- [ ] Image Colour Extractor (dominant palette from uploaded image)
- [ ] Placeholder Image Generator (custom size, colour, text)

#### Color Tools

- [ ] Colour Palette Generator (complementary, analogous, triadic)
- [ ] Gradient Generator (CSS linear / radial gradient builder)
- [ ] Contrast Checker (WCAG AA / AAA ratio)
- [ ] CSS Shadow Generator (box-shadow, text-shadow builder)

#### Calculators

- [ ] Percentage Calculator
- [ ] BMI Calculator
- [ ] Loan Comparison Tool
- [ ] Currency Converter (static rates; live rates via optional API key)
- [ ] Unit Converter (length, weight, temperature, volume, speed)
- [ ] Timezone Converter

#### SEO Tools

- [ ] Robots.txt Generator
- [ ] Open Graph Previewer (paste a URL, see the OG card)
- [ ] Character Counter (for meta titles and descriptions)

#### Utilities

- [ ] URL Parser (break a URL into components)
- [ ] IP Address Info (user's own IP; no external API required)
- [ ] Random Number Generator
- [ ] Coin Flip / Dice Roller
- [ ] Pomodoro Timer
- [ ] Online Stopwatch / Countdown Timer

### Infrastructure

- [ ] Testing baseline (Playwright for critical paths; Vitest for utilities)
- [ ] GitHub Actions CI (build, lint, typecheck on every PR)
- [ ] Lighthouse CI on every PR
- [ ] Screenshot automation for README

---

## Future Ideas

These are not committed; they need community interest and contributor bandwidth.

### Expanded Tool Categories

- **PDF Tools** — PDF merge, split, compress, PDF to image (client-side via PDF.js)
- **Audio Tools** — online metronome, tone generator, audio frequency analyser
- **Network Tools** — SSL checker, DNS lookup, HTTP header inspector (server-side)
- **Finance Tools** — compound interest, net worth tracker, FIRE calculator

### Platform Enhancements

- **Offline / PWA** — service worker, installable app, offline tool support
- **Keyboard shortcuts** — per-tool shortcut map (copy output, clear, submit)
- **Tool collections** — curated sets for "Frontend Developer Toolkit", "SEO Starter Pack"
- **Internationalisation (i18n)** — UI in multiple languages; right-to-left support
- **Additional themes** — high-contrast theme, OLED dark theme
- **Embeddable widgets** — `<iframe>` or Web Component for embedding individual tools

### Community & Ecosystem

- **Browser extension** — right-click context menu to open the relevant OnlineUtility tool
- **Public API** — REST endpoints for tools that are naturally server-side (hashing, formatting)
- **Plugin system** — allow community-contributed tools to be loaded without a core PR
- **Tool marketplace** — community-submitted tools with a review / quality gate
- **AI-assisted utilities** — text summariser, code explainer, grammar corrector (opt-in, key-per-user)
- **Mobile apps** — React Native wrapper for iOS and Android

---

## Version Milestones

| Milestone | Goal                                      |
| --------- | ----------------------------------------- |
| v0.1      | Foundation + QR Code Generator (current)  |
| v0.2      | All 20 registered tools fully implemented |
| v0.3      | Testing baseline + CI pipeline            |
| v0.4      | Image and PDF tool category               |
| v0.5      | PWA + offline support                     |
| v1.0      | 50+ tools, full test coverage, stable API |
