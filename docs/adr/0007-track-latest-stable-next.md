# ADR-0007: Track latest stable Next.js (16, not 15)

- **Status:** Accepted
- **Date:** 2026-06-23

## Context

The PRD text says "Next.js 15" in several places but also instructs "use the latest stable versions." When the project was scaffolded, `create-next-app@latest` installed **Next.js 16** (with React 19) as the current stable release. This is a direct conflict in the requirements that needed an explicit, recorded resolution so future contributors don't "correct" the version back to 15.

## Decision

**Track the latest stable Next.js** — currently **16.x** — rather than pinning to 15. The "latest stable" instruction governs; the App Router architecture the PRD describes is identical between 15 and 16. Confirmed with the project owner on 2026-06-23.

## Alternatives considered

- **Pin to Next.js 15** — matches the literal "15" in the PRD, but contradicts "use latest stable", means starting a brand-new project on an older minor, and gains nothing architecturally.

## Consequences

- **Positive:** newest features, fixes and performance; no immediate upgrade debt; aligns with the explicit "latest stable" directive.
- **Negative / trade-offs:** some Next 16 specifics differ from 15-era docs (e.g. **`params` is async/`Promise`** in route handlers and `generateMetadata`).
- **Follow-ups:** **do not downgrade to 15.** This is also recorded in project memory (`stack-deviations`) and in [CLAUDE.md](../../CLAUDE.md). Keep dependencies on the current stable line going forward.
