import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type ProjectViewerRole = "owner" | "collaborator";

export interface AccessibleProject {
  id: string;
  name: string;
  ownerId: string;
  viewerRole: ProjectViewerRole;
}

export function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? null;
}

export async function getCurrentUserIdentity() {
  const user = await currentUser();
  if (!user) return null;
  const primaryEmail = normalizeEmail(
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress,
  );
  return { userId: user.id, primaryEmail };
}

export async function getAccessibleProject(
  projectId: string,
  userId: string,
  primaryEmail: string | null,
): Promise<AccessibleProject | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  });

  if (!project) return null;
  if (project.ownerId === userId) {
    return { ...project, viewerRole: "owner" };
  }

  const normalizedEmail = normalizeEmail(primaryEmail);

  if (normalizedEmail) {
    const collab = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email: normalizedEmail } },
      select: { projectId: true },
    });
    if (collab) {
      return { ...project, viewerRole: "collaborator" };
    }
  }

  return null;
}
