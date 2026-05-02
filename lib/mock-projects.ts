import type { Project } from "@/hooks/use-project-dialogs";

export const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "Ghost AI", slug: "ghost-ai", role: "owner" },
  { id: "2", name: "Design System", slug: "design-system", role: "owner" },
  { id: "3", name: "Shared Workspace", slug: "shared-workspace", role: "collaborator" },
];
