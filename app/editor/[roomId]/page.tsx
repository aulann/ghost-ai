import { redirect } from "next/navigation";

import { getCurrentUserIdentity, getAccessibleProject } from "@/lib/project-access";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "@/components/editor/workspace-shell";

interface WorkspacePageProps {
  params: Promise<{ roomId: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { roomId } = await params;

  const identity = await getCurrentUserIdentity();
  if (!identity) {
    redirect("/sign-in");
  }

  const project = await getAccessibleProject(
    roomId,
    identity.userId,
    identity.primaryEmail,
  );

  if (!project) {
    return <AccessDenied />;
  }

  return <WorkspaceShell projectName={project.name} />;
}
