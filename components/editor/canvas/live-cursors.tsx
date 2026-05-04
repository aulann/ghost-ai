"use client";

import { createPortal } from "react-dom";
import { useOthers } from "@liveblocks/react";
import { useReactFlow, useViewport } from "@xyflow/react";

function CursorIcon({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1 L1 14 L4.5 10.5 L7 16.5 L9 15.5 L6.5 9.5 L11 9.5 Z"
        fill={color}
        stroke="white"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LiveCursors() {
  const others = useOthers();
  const { flowToScreenPosition } = useReactFlow();
  useViewport(); // re-render on pan/zoom so flowToScreenPosition stays accurate

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[200]">
      {others.map((other) => {
        const cursor = other.presence.cursor;
        if (!cursor) return null;

        const { x, y } = flowToScreenPosition({ x: cursor.x, y: cursor.y });
        const color = other.info?.cursorColor ?? "#808090";
        const name = other.info?.name ?? "Unknown";

        return (
          <div
            key={other.connectionId}
            className="absolute flex flex-col items-start gap-0.5"
            style={{ left: x, top: y }}
          >
            <CursorIcon color={color} />
            <div
              className="rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-tight text-white"
              style={{ backgroundColor: color }}
            >
              {name}
            </div>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
