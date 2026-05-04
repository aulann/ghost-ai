# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 12: Shape panel

## Current Goal

- Feature 12 is implemented and verified with a successful `npm run build`.

## Completed

- Feature 01: Design system - shadcn/ui initialized, lucide-react installed, all 7 UI primitives added (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), `lib/utils.ts` with `cn()` created, `globals.css` set up with project dark theme tokens and fixed font mapping, `dark` class applied to `<html>`.
- Feature 02: Editor chrome - `components/editor/editor-navbar.tsx` (fixed top bar, left/center/right sections, sidebar toggle with `PanelLeftOpen`/`PanelLeftClose`) and `components/editor/project-sidebar.tsx` (fixed overlay, slides in from left, `isOpen`/`onClose` props, Projects header, My Projects + Shared tabs with empty states, full-width New Project button). Shadcn Dialog already supports title/description/footer - no new dialog built.
- Feature 03: Auth - `@clerk/ui` installed; `ClerkProvider` wraps root layout with `dark` theme from `@clerk/ui/themes` and CSS variable overrides (no hardcoded colors); `proxy.ts` at project root uses `clerkMiddleware` + `createRouteMatcher` to protect all routes except `/sign-in` and `/sign-up`; `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` use two-panel layout (logo/tagline left on lg+, Clerk form right, form-only on mobile); `app/page.tsx` redirects authenticated users to `/editor` and unauthenticated to `/sign-in`; `UserButton` added to editor navbar right section.
- Feature 04: Editor home screen and project dialogs - `app/editor/page.tsx` shows heading/description/New Project button; `hooks/use-project-dialogs.ts` manages dialog/form/loading state; `CreateProjectDialog` (live slug preview), `RenameProjectDialog` (prefilled + Enter submits), `DeleteProjectDialog` (destructive confirm) in `components/editor/dialogs/`; `ProjectSidebar` updated with mock project items, per-row rename/delete actions (owner-only, hover-reveal), mobile backdrop scrim; `context/project-dialog-context.tsx` provides `openCreate` to the editor page; all three dialogs wired in `app/editor/layout.tsx`.
- Feature 05: Prisma data models and client - `prisma/models/project.prisma` defines `Project` (ownerId, name, description?, status enum DRAFT/ARCHIVED, canvasJsonPath?, timestamps, indexes on ownerId and createdAt) and `ProjectCollaborator` (projectId with cascade delete, email, createdAt, unique on project/email, indexes on email and projectId/date); `lib/prisma.ts` exports a cached singleton branching on `DATABASE_URL` prefix (`prisma+postgres://` -> Accelerate via `accelerateUrl`, otherwise `@prisma/adapter-pg` with `pg.Pool`); migration `20260503191506_init` applied to Prisma Postgres database.
- Feature 06: Project API routes - `app/api/projects/route.ts` (GET list by ownerId desc, POST create with default name "Untitled Project"); `app/api/projects/[projectId]/route.ts` (PATCH rename, DELETE delete); all handlers enforce auth via Clerk `auth()` returning 401 for unauthenticated, 403 for non-owner mutations; params awaited as Promise per Next.js 16 convention; build passes.
- Feature 07: Wire editor home - `lib/data/projects.ts` server-side helpers (`getOwnedProjects`, `getSharedProjects`); `hooks/use-project-actions.ts` manages dialog state and calls real API (POST create -> navigate to `/editor/[id]`, PATCH rename -> `router.refresh()`, DELETE delete -> redirect if active else refresh); `app/editor/layout.tsx` converted to async server component using `currentUser()` to fetch owned and shared project lists; `components/editor/editor-shell.tsx` client component holds sidebar toggle, dialog state, and context provider; `components/editor/new-project-button.tsx` thin client button consuming `ProjectDialogContext`; `app/editor/page.tsx` is now a server component using `NewProjectButton`; `ProjectSidebar` accepts `ownedProjects`/`sharedProjects` props and navigates via `<Link>`; `CreateProjectDialog` shows `roomIdPreview` (slug + short suffix) prop instead of computing internally; mock data and old `use-project-dialogs` hook removed; build passes.
- Feature 08: Editor workspace shell - `lib/project-access.ts` with `getCurrentUserIdentity()` (userId + primaryEmail from Clerk) and `getAccessibleProject()` (owner or collaborator check via Prisma); `components/editor/access-denied.tsx` (centered lock icon + message + back link); `app/editor/[roomId]/page.tsx` server component with unauthenticated redirect to `/sign-in` and `AccessDenied` for missing/unauthorized projects; `components/editor/workspace-context.tsx` provides `WorkspaceContext` (setProjectName, aiOpen, toggleAi) for `EditorShell` -> `EditorNavbar` / `WorkspaceShell` coordination; `EditorShell` holds workspace state and provides context; `EditorNavbar` shows project name + "Workspace" subtitle, Share button, and AI toggle (with `bg-ai-dim` active tint) when in workspace mode; `WorkspaceShell` uses context to register project name on mount and reads `aiOpen` to conditionally render the AI sidebar (AI Copilot header + placeholder cards); `ProjectSidebar` uses `usePathname()` to highlight the active room item with a green dot + `bg-elevated`; `--color-ai-dim` token added to `globals.css`; `lib/prisma.ts` normalizes `sslmode=require|prefer|verify-ca` -> `verify-full` to suppress `pg-connection-string` deprecation warning; build passes.
- Feature 09: Share dialog - `app/api/projects/[projectId]/collaborators/route.ts` adds authenticated GET list and owner-only POST invite handlers; `app/api/projects/[projectId]/collaborators/[collaboratorId]/route.ts` adds owner-only DELETE removal; `lib/project-share.ts` enriches collaborator emails with Clerk Backend API display names and avatar URLs while falling back to email-only rows when no Clerk user exists and now includes the owner row in the access list; `components/editor/dialogs/project-share-dialog.tsx` and `hooks/use-project-share.ts` add the workspace share modal with owner invite/remove/copy-link flows, collaborator read-only mode, role badges, and the refined screenshot-style card layout; `components/editor/editor-shell.tsx` and `components/editor/editor-navbar.tsx` wire the navbar Share button to the live dialog; collaborator emails are normalized to lowercase in access helpers and shared-project lookups for consistent membership matching; build passes.
- Feature 10: Liveblocks setup - `liveblocks.config.ts` defines `Presence` (cursor `{ x, y } | null` and `isThinking` boolean) and `UserMeta` (id, name, avatar, cursorColor); `lib/liveblocks.ts` exports a lazy-initialized cached Liveblocks node client via `getLiveblocks()` and a deterministic `getUserCursorColor(userId)` helper mapping user IDs to a 10-color palette; `app/api/liveblocks-auth/route.ts` POST handler requires Clerk auth, verifies project access via `getAccessibleProject`, ensures the room exists with `getOrCreateRoom`, and issues an access-token session with the user's display name, avatar, and cursor color; returns 403 for unauthorized access; `@liveblocks/node` installed; build passes.
- Feature 11: Base canvas - `types/canvas.ts` defines `CanvasNodeData` (label, color, shape) and typed `CanvasNode`/`CanvasEdge` aliases; `components/editor/canvas/canvas-wrapper.tsx` client component sets up `LiveblocksProvider` (authEndpoint `/api/liveblocks-auth`), `RoomProvider` (room ID + initial presence `{ cursor: null, isThinking: false }`), a class-based `CanvasErrorBoundary`, and `ClientSideSuspense` with a loading state; `components/editor/canvas/canvas-flow.tsx` uses `useLiveblocksFlow<CanvasNode, CanvasEdge>({ suspense: true })` wired into `<ReactFlow>` with loose `ConnectionMode`, `fitView`, `MiniMap`, and dot-pattern `Background`; `WorkspaceShell` updated to accept `roomId` prop and render `CanvasWrapper` in place of the placeholder; workspace page passes `roomId` through; build passes.
- Feature 12: Shape panel - `types/canvas.ts` extended with `NODE_SHAPES` const array, `NodeShape` union type, `ShapeDefault` interface, `SHAPE_DEFAULTS` record (rectangle 160×80, diamond 180×120, circle 100×100, pill 160×70, cylinder 120×100, hexagon 140×110), and `DEFAULT_NODE_COLOR`; `components/editor/canvas/canvas-node.tsx` custom node renderer for `canvasNode` type using size from `data.width`/`data.height` and background from `data.color`, four `Handle` elements at all four sides, label centered; `components/editor/canvas/shape-panel.tsx` floating pill toolbar with six draggable icon buttons (Square, Diamond, Circle, Pill, Database, Hexagon from lucide-react), `onDragStart` sets `application/ghost-shape` payload with shape name and default dimensions; `canvas-flow.tsx` updated to register `nodeTypes`, capture ReactFlow instance via `onInit`, handle `onDragOver`/`onDrop` on the `<ReactFlow>` element (drop converts screen position to canvas coordinates via `screenToFlowPosition`, centers node on cursor, adds via `onNodesChange([{ type: 'add', item }])`), node IDs generated as `{shape}-{timestamp}-{counter}`, `ShapePanel` mounted in a `<Panel position="bottom-center">`; build passes.

## In Progress

- None.

## Next Up

- Await Feature 13 spec.

## Open Questions

- None yet.

## Architecture Decisions

- Auth uses `proxy.ts` (Next.js 16 rename of `middleware.ts`) - same API, same export conventions.
- Prisma v7 breaking change: `url` is no longer supported in the schema datasource block; connection config lives entirely in `prisma.config.ts` (for CLI/migrations) and the `PrismaClient` constructor (for queries).
- Prisma generated client output is `app/generated/prisma/`; import entry point is `@/app/generated/prisma/client` (no `index.ts` - the generated file is `client.ts`).
- Dark-only theme enforced via `dark` class on `<html>`. No light mode.
- shadcn/ui components live in `components/ui/` - never hand-edited.
- CSS custom properties defined in `globals.css` under `:root`; `@theme inline` bridges them to Tailwind utilities (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-brand-dim`, etc.).
- Fonts mapped with literal names in `@theme inline` (Tailwind v4 build-time resolution - `var(--font-geist-sans)` would not work there).
- Collaborator membership is matched on normalized lowercase email strings so Clerk primary-email checks, shared project queries, and invite records stay consistent.

## Session Notes

- Tailwind v4 in use - all configuration is CSS-only, no `tailwind.config.ts`.
- shadcn CLI v4 / style `base-nova`, Radix primitives, lucide icon library.
- `components.json` is at project root; do not delete it.
