import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

import { Prisma } from "@/app/generated/prisma/client";
import {
  getAccessibleProject,
  getCurrentUserIdentity,
  normalizeEmail,
} from "@/lib/project-access";
import { prisma } from "@/lib/prisma";
import { listProjectAccessMembers } from "@/lib/project-share";

interface CollaboratorsRouteContext {
  params: Promise<{ projectId: string }>;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getProjectForViewer(projectId: string, userId: string) {
  const identity = await getCurrentUserIdentity();
  if (!identity || identity.userId !== userId) {
    return null;
  }

  const project = await getAccessibleProject(
    projectId,
    identity.userId,
    identity.primaryEmail,
  );

  if (!project) {
    return null;
  }

  return { identity, project };
}

async function buildCollaboratorsResponse(
  projectId: string,
  ownerId: string,
  viewerRole: "owner" | "collaborator",
) {
  return Response.json({
    viewerRole,
    collaborators: await listProjectAccessMembers(projectId, ownerId),
  });
}

export async function GET(
  _request: NextRequest,
  { params }: CollaboratorsRouteContext,
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await getProjectForViewer(projectId, userId);

  if (!access) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return buildCollaboratorsResponse(
    projectId,
    access.project.ownerId,
    access.project.viewerRole,
  );
}

export async function POST(
  request: NextRequest,
  { params }: CollaboratorsRouteContext,
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await getProjectForViewer(projectId, userId);

  if (!access) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (access.project.viewerRole !== "owner") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(
    typeof body?.email === "string" ? body.email : null,
  );

  if (!email || !isValidEmail(email)) {
    return Response.json({ error: "A valid email is required" }, { status: 400 });
  }

  if (email === access.identity.primaryEmail) {
    return Response.json(
      { error: "The project owner already has access" },
      { status: 400 },
    );
  }

  try {
    await prisma.projectCollaborator.create({
      data: {
        projectId,
        email,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "That collaborator already has access" },
        { status: 409 },
      );
    }

    throw error;
  }

  return Response.json(
    {
      viewerRole: "owner",
      collaborators: await listProjectAccessMembers(projectId, access.project.ownerId),
    },
    { status: 201 },
  );
}
