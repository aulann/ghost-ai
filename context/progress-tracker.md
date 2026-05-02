# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1 — Foundation

## Current Goal

- Feature 02: next planned feature unit.

## Completed

- Feature 01: Design system — shadcn/ui initialized, lucide-react installed, all 7 UI primitives added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), `lib/utils.ts` with `cn()` created, `globals.css` set up with project dark theme tokens and fixed font mapping, `dark` class applied to `<html>`.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Dark-only theme enforced via `dark` class on `<html>`. No light mode.
- shadcn/ui components live in `components/ui/` — never hand-edited.
- CSS custom properties defined in `globals.css` under `:root`; `@theme inline` bridges them to Tailwind utilities (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-brand-dim`, etc.).
- Fonts mapped with literal names in `@theme inline` (Tailwind v4 build-time resolution — `var(--font-geist-sans)` would not work there).

## Session Notes

- Tailwind v4 in use — all configuration is CSS-only, no `tailwind.config.ts`.
- shadcn CLI v4 / style `base-nova`, Radix primitives, lucide icon library.
- `components.json` is at project root; do not delete it.
