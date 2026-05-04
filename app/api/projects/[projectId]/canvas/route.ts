import type { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import {
  getCurrentUserIdentity,
  getAccessibleProject,
} from "@/lib/project-access";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const identity = await getCurrentUserIdentity();
  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const access = await getAccessibleProject(
    projectId,
    identity.userId,
    identity.primaryEmail,
  );
  if (!access) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const record = await prisma.project.findUnique({
    where: { id: projectId },
    select: { canvasJsonPath: true },
  });

  if (!record?.canvasJsonPath) {
    return Response.json({ nodes: [], edges: [] });
  }

  const blobHeaders: HeadersInit = process.env.BLOB_READ_WRITE_TOKEN
    ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
    : {};
  const blobRes = await fetch(record.canvasJsonPath, {
    headers: blobHeaders,
  }).catch(() => null);
  if (!blobRes?.ok) {
    return Response.json({ nodes: [], edges: [] });
  }

  const canvas: unknown = await blobRes.json().catch(() => null);
  if (!canvas || typeof canvas !== "object") {
    return Response.json({ nodes: [], edges: [] });
  }

  return Response.json(canvas);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const identity = await getCurrentUserIdentity();
  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  const access = await getAccessibleProject(
    projectId,
    identity.userId,
    identity.primaryEmail,
  );
  if (!access) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray((body as { nodes?: unknown }).nodes) ||
    !Array.isArray((body as { edges?: unknown }).edges)
  ) {
    return Response.json(
      { error: "Canvas payload must include nodes and edges arrays" },
      { status: 400 },
    );
  }

  let blob;
  try {
    blob = await put(`canvas/${projectId}.json`, JSON.stringify(body), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (err) {
    console.error("[canvas PUT] Vercel Blob upload failed:", err);
    return Response.json(
      { error: "Failed to upload canvas to storage" },
      { status: 500 },
    );
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { canvasJsonPath: blob.url },
  });

  return Response.json({ url: blob.url });
}
