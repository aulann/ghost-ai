# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 08 (TBD)

## Current Goal

- To be determined for Feature 08.

## Completed

- Feature 01: Design system — shadcn/ui initialized, lucide-react installed, all 7 UI primitives added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), `lib/utils.ts` with `cn()` created, `globals.css` set up with project dark theme tokens and fixed font mapping, `dark` class applied to `<html>`.
- Feature 02: Editor chrome — `components/editor/editor-navbar.tsx` (fixed top bar, left/center/right sections, sidebar toggle with `PanelLeftOpen`/`PanelLeftClose`) and `components/editor/project-sidebar.tsx` (fixed overlay, slides in from left, `isOpen`/`onClose` props, Projects header, My Projects + Shared tabs with empty states, full-width New Project button). Shadcn Dialog already supports title/description/footer — no new dialog built.
- Feature 03: Auth — `@clerk/ui` installed; `ClerkProvider` wraps root layout with `dark` theme from `@clerk/ui/themes` and CSS variable overrides (no hardcoded colors); `proxy.ts` at project root uses `clerkMiddleware` + `createRouteMatcher` to protect all routes except `/sign-in` and `/sign-up`; `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` use two-panel layout (logo/tagline left on lg+, Clerk form right, form-only on mobile); `app/page.tsx` redirects authenticated users to `/editor` and unauthenticated to `/sign-in`; `UserButton` added to editor navbar right section.
- Feature 04: Editor home screen and project dialogs — `app/editor/page.tsx` shows heading/description/New Project button; `hooks/use-project-dialogs.ts` manages dialog/form/loading state; `CreateProjectDialog` (live slug preview), `RenameProjectDialog` (prefilled + Enter submits), `DeleteProjectDialog` (destructive confirm) in `components/editor/dialogs/`; `ProjectSidebar` updated with mock project items, per-row rename/delete actions (owner-only, hover-reveal), mobile backdrop scrim; `context/project-dialog-context.tsx` provides `openCreate` to the editor page; all three dialogs wired in `app/editor/layout.tsx`.
- Feature 05: Prisma data models and client — `prisma/models/project.prisma` defines `Project` (ownerId, name, description?, status enum DRAFT/ARCHIVED, canvasJsonPath?, timestamps, indexes on ownerId and createdAt) and `ProjectCollaborator` (projectId with cascade delete, email, createdAt, unique on project/email, indexes on email and projectId/date); `lib/prisma.ts` exports a cached singleton branching on `DATABASE_URL` prefix (`prisma+postgres://` → Accelerate via `accelerateUrl`, otherwise `@prisma/adapter-pg` with `pg.Pool`); migration `20260503191506_init` applied to Prisma Postgres database.
- Feature 06: Project API routes — `app/api/projects/route.ts` (GET list by ownerId desc, POST create with default name "Untitled Project"); `app/api/projects/[projectId]/route.ts` (PATCH rename, DELETE delete); all handlers enforce auth via Clerk `auth()` returning 401 for unauthenticated, 403 for non-owner mutations; params awaited as Promise per Next.js 16 convention; build passes.
- Feature 07: Wire editor home — `lib/data/projects.ts` server-side helpers (`getOwnedProjects`, `getSharedProjects`); `hooks/use-project-actions.ts` manages dialog state and calls real API (POST create → navigate to `/editor/[id]`, PATCH rename → `router.refresh()`, DELETE delete → redirect if active else refresh); `app/editor/layout.tsx` converted to async server component using `currentUser()` to fetch owned and shared project lists; `components/editor/editor-shell.tsx` client component holds sidebar toggle, dialog state, and context provider; `components/editor/new-project-button.tsx` thin client button consuming `ProjectDialogContext`; `app/editor/page.tsx` is now a server component using `NewProjectButton`; `ProjectSidebar` accepts `ownedProjects`/`sharedProjects` props and navigates via `<Link>`; `CreateProjectDialog` shows `roomIdPreview` (slug + short suffix) prop instead of computing internally; mock data and old `use-project-dialogs` hook removed; build passes.

## In Progress

- None.

## Next Up

- Feature 08 (TBD)

## Open Questions

- None yet.

## Architecture Decisions

- Auth uses `proxy.ts` (Next.js 16 rename of `middleware.ts`) — same API, same export conventions.
- Prisma v7 breaking change: `url` is no longer supported in the schema datasource block; connection config lives entirely in `prisma.config.ts` (for CLI/migrations) and the `PrismaClient` constructor (for queries).
- Prisma generated client output is `app/generated/prisma/`; import entry point is `@/app/generated/prisma/client` (no `index.ts` — the generated file is `client.ts`).
- Dark-only theme enforced via `dark` class on `<html>`. No light mode.
- shadcn/ui components live in `components/ui/` — never hand-edited.
- CSS custom properties defined in `globals.css` under `:root`; `@theme inline` bridges them to Tailwind utilities (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-brand-dim`, etc.).
- Fonts mapped with literal names in `@theme inline` (Tailwind v4 build-time resolution — `var(--font-geist-sans)` would not work there).

## Session Notes

- Tailwind v4 in use — all configuration is CSS-only, no `tailwind.config.ts`.
- shadcn CLI v4 / style `base-nova`, Radix primitives, lucide icon library.
- `components.json` is at project root; do not delete it.
