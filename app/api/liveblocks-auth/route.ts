import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getLiveblocks, getUserCursorColor } from "@/lib/liveblocks";
import { getCurrentUserIdentity, getAccessibleProject } from "@/lib/project-access";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const { room } = await request.json();
  if (typeof room !== "string" || !room) {
    return new NextResponse(null, { status: 400 });
  }

  const identity = await getCurrentUserIdentity();
  if (!identity) {
    return new NextResponse(null, { status: 401 });
  }

  const project = await getAccessibleProject(room, identity.userId, identity.primaryEmail);
  if (!project) {
    return new NextResponse(null, { status: 403 });
  }

  const liveblocks = getLiveblocks();
  await liveblocks.getOrCreateRoom(room, { defaultAccesses: [] });

  const name =
    user.fullName?.trim() ||
    user.username?.trim() ||
    user.primaryEmailAddress?.emailAddress ||
    "Unknown";

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name,
      avatar: user.imageUrl,
      cursorColor: getUserCursorColor(user.id),
    },
  });
  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
