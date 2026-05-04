import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

import {
  getAccessibleProject,
  getCurrentUserIdentity,
} from "@/lib/project-access";
import { prisma } from "@/lib/prisma";
import { listProjectAccessMembers } from "@/lib/project-share";

interface DeleteCollaboratorRouteContext {
  params: Promise<{ projectId: string; collaboratorId: string }>;
}

export async function DELETE(
  _request: NextRequest,
  { params }: DeleteCollaboratorRouteContext,
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, collaboratorId } = await params;

  const identity = await getCurrentUserIdentity();
  if (!identity || identity.userId !== userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await getAccessibleProject(
    projectId,
    identity.userId,
    identity.primaryEmail,
  );

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (project.viewerRole !== "owner") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await prisma.projectCollaborator.deleteMany({
    where: {
      id: collaboratorId,
      projectId,
    },
  });

  if (result.count === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({
    viewerRole: "owner",
    collaborators: await listProjectAccessMembers(projectId, project.ownerId),
  });
}
