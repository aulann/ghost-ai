import { clerkClient } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/project-access";

export interface ProjectAccessMember {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: "owner" | "collaborator";
}

interface ClerkUserDetails {
  avatarUrl: string | null;
  displayName: string | null;
}

function getDisplayName(fullName: string | null, username: string | null) {
  if (fullName?.trim()) return fullName.trim();
  if (username?.trim()) return username.trim();
  return null;
}

async function getClerkUserLookup(emails: string[]) {
  if (emails.length === 0) {
    return new Map<string, ClerkUserDetails>();
  }

  const client = await clerkClient();
  const response = await client.users.getUserList({
    emailAddress: emails,
    limit: emails.length,
  });

  const lookup = new Map<string, ClerkUserDetails>();

  for (const user of response.data) {
    const details: ClerkUserDetails = {
      avatarUrl: user.imageUrl ?? null,
      displayName: getDisplayName(user.fullName, user.username),
    };

    for (const emailAddress of user.emailAddresses) {
      const normalized = normalizeEmail(emailAddress.emailAddress);
      if (normalized && emails.includes(normalized) && !lookup.has(normalized)) {
        lookup.set(normalized, details);
      }
    }
  }

  return lookup;
}

async function getProjectOwner(ownerId: string): Promise<ProjectAccessMember | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(ownerId);
    const ownerEmail = normalizeEmail(user.primaryEmailAddress?.emailAddress);

    if (!ownerEmail) {
      return null;
    }

    return {
      id: `owner:${ownerId}`,
      email: ownerEmail,
      displayName: getDisplayName(user.fullName, user.username),
      avatarUrl: user.imageUrl ?? null,
      role: "owner",
    };
  } catch {
    return null;
  }
}

export async function listProjectAccessMembers(
  projectId: string,
  ownerId: string,
): Promise<ProjectAccessMember[]> {
  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true },
  });

  const emailLookup = await getClerkUserLookup(
    Array.from(new Set(collaborators.map((collaborator) => collaborator.email))),
  );

  const owner = await getProjectOwner(ownerId);

  const collaboratorMembers = collaborators.map((collaborator) => {
    const clerkUser = emailLookup.get(collaborator.email);

    return {
      id: collaborator.id,
      email: collaborator.email,
      displayName: clerkUser?.displayName ?? null,
      avatarUrl: clerkUser?.avatarUrl ?? null,
      role: "collaborator" as const,
    };
  });

  return owner ? [owner, ...collaboratorMembers] : collaboratorMembers;
}
