import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/project-access";

export async function getOwnedProjects(userId: string) {
  return prisma.project.findMany({
    where: { ownerId: userId },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSharedProjects(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return [];
  }

  const collabs = await prisma.projectCollaborator.findMany({
    where: { email: normalizedEmail },
    select: { project: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return collabs.map((c) => c.project);
}
