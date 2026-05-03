import { currentUser } from "@clerk/nextjs/server";

import { getOwnedProjects, getSharedProjects } from "@/lib/data/projects";
import { EditorShell } from "@/components/editor/editor-shell";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  const primaryEmail = user?.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId,
  )?.emailAddress;

  const [owned, shared] = await Promise.all([
    user?.id ? getOwnedProjects(user.id) : Promise.resolve([]),
    primaryEmail ? getSharedProjects(primaryEmail) : Promise.resolve([]),
  ]);

  const ownedProjects = owned.map((p) => ({ ...p, role: "owner" as const }));
  const sharedProjects = shared.map((p) => ({ ...p, role: "collaborator" as const }));

  return (
    <EditorShell ownedProjects={ownedProjects} sharedProjects={sharedProjects}>
      {children}
    </EditorShell>
  );
}
