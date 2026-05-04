"use client";

import { Component, type ReactNode } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";

import { CanvasFlow } from "./canvas-flow";

interface CanvasWrapperProps {
  roomId: string;
  projectId: string;
}

export function CanvasWrapper({ roomId, projectId }: CanvasWrapperProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, thinking: false }}
      >
        <CanvasErrorBoundary fallback={<CanvasError />}>
          <ClientSideSuspense fallback={<CanvasLoading />}>
            <CanvasFlow projectId={projectId} />
          </ClientSideSuspense>
        </CanvasErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function CanvasLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base">
      <p className="text-sm text-copy-muted">Connecting to canvas…</p>
    </div>
  );
}

function CanvasError() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base">
      <p className="text-sm text-copy-muted">
        Failed to connect to the canvas. Please refresh.
      </p>
    </div>
  );
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
