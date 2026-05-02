# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1 — Foundation

## Current Goal

- Feature 04: next planned feature unit.

## Completed

- Feature 01: Design system — shadcn/ui initialized, lucide-react installed, all 7 UI primitives added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), `lib/utils.ts` with `cn()` created, `globals.css` set up with project dark theme tokens and fixed font mapping, `dark` class applied to `<html>`.
- Feature 02: Editor chrome — `components/editor/editor-navbar.tsx` (fixed top bar, left/center/right sections, sidebar toggle with `PanelLeftOpen`/`PanelLeftClose`) and `components/editor/project-sidebar.tsx` (fixed overlay, slides in from left, `isOpen`/`onClose` props, Projects header, My Projects + Shared tabs with empty states, full-width New Project button). Shadcn Dialog already supports title/description/footer — no new dialog built.
- Feature 03: Auth — `@clerk/ui` installed; `ClerkProvider` wraps root layout with `dark` theme from `@clerk/ui/themes` and CSS variable overrides (no hardcoded colors); `proxy.ts` at project root uses `clerkMiddleware` + `createRouteMatcher` to protect all routes except `/sign-in` and `/sign-up`; `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` use two-panel layout (logo/tagline left on lg+, Clerk form right, form-only on mobile); `app/page.tsx` redirects authenticated users to `/editor` and unauthenticated to `/sign-in`; `UserButton` added to editor navbar right section.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Auth uses `proxy.ts` (Next.js 16 rename of `middleware.ts`) — same API, same export conventions.
- Dark-only theme enforced via `dark` class on `<html>`. No light mode.
- shadcn/ui components live in `components/ui/` — never hand-edited.
- CSS custom properties defined in `globals.css` under `:root`; `@theme inline` bridges them to Tailwind utilities (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-brand-dim`, etc.).
- Fonts mapped with literal names in `@theme inline` (Tailwind v4 build-time resolution — `var(--font-geist-sans)` would not work there).

## Session Notes

- Tailwind v4 in use — all configuration is CSS-only, no `tailwind.config.ts`.
- shadcn CLI v4 / style `base-nova`, Radix primitives, lucide icon library.
- `components.json` is at project root; do not delete it.
