"use client";

import { useOthers } from "@liveblocks/react";
import { useUser, UserButton } from "@clerk/nextjs";

interface CollaboratorAvatarProps {
  name: string;
  imageUrl?: string;
  color: string;
}

function CollaboratorAvatar({ name, imageUrl, color }: CollaboratorAvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full"
      style={{ boxShadow: `0 0 0 2px ${color}, 0 0 0 3.5px #111114` }}
      title={name}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

export function PresenceAvatars() {
  const { user } = useUser();
  const others = useOthers();

  const collaborators = others.filter((other) => other.id !== user?.id);
  const visible = collaborators.slice(0, 5);
  const overflow = Math.max(0, collaborators.length - 5);

  return (
    <div className="flex items-center gap-2">
      {collaborators.length > 0 && (
        <>
          <div className="flex items-center">
            {visible.map((other, i) => (
              <div
                key={other.connectionId}
                className="relative"
                style={{ marginLeft: i === 0 ? 0 : -6 }}
              >
                <CollaboratorAvatar
                  name={other.info?.name ?? "Unknown"}
                  imageUrl={other.info?.avatar}
                  color={other.info?.cursorColor ?? "#808090"}
                />
              </div>
            ))}
            {overflow > 0 && (
              <div
                className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-elevated text-[10px] font-medium text-copy-secondary"
                style={{
                  marginLeft: -6,
                  boxShadow: "0 0 0 2px #808090, 0 0 0 3.5px #111114",
                }}
              >
                +{overflow}
              </div>
            )}
          </div>
          <div className="h-4 w-px bg-surface-border" />
        </>
      )}
      <UserButton />
    </div>
  );
}
