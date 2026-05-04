"use client";

import { ZoomIn, ZoomOut, Maximize2, Undo2, Redo2 } from "lucide-react";
import { useUndo, useRedo, useCanUndo, useCanRedo } from "@liveblocks/react";

interface ZoomControls {
  zoomIn(options?: { duration?: number }): void;
  zoomOut(options?: { duration?: number }): void;
  fitView(options?: { duration?: number }): void;
}

interface CanvasControlBarProps {
  rfInstance: ZoomControls | null;
}

export function CanvasControlBar({ rfInstance }: CanvasControlBarProps) {
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  return (
    <div className="flex items-center gap-1 rounded-full border border-surface-border bg-surface px-3 py-2 shadow-lg">
      <button
        onClick={() => rfInstance?.zoomOut({ duration: 200 })}
        title="Zoom out"
        className="flex h-8 w-8 items-center justify-center rounded-xl text-copy-muted transition-colors hover:bg-elevated hover:text-copy-primary"
      >
        <ZoomOut className="h-4 w-4" />
      </button>
      <button
        onClick={() => rfInstance?.fitView({ duration: 300 })}
        title="Fit view"
        className="flex h-8 w-8 items-center justify-center rounded-xl text-copy-muted transition-colors hover:bg-elevated hover:text-copy-primary"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => rfInstance?.zoomIn({ duration: 200 })}
        title="Zoom in"
        className="flex h-8 w-8 items-center justify-center rounded-xl text-copy-muted transition-colors hover:bg-elevated hover:text-copy-primary"
      >
        <ZoomIn className="h-4 w-4" />
      </button>

      <div className="mx-1 h-5 w-px bg-surface-border" />

      <button
        onClick={undo}
        disabled={!canUndo}
        title="Undo"
        className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-elevated disabled:opacity-30 disabled:pointer-events-none text-copy-muted hover:text-copy-primary"
      >
        <Undo2 className="h-4 w-4" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        title="Redo"
        className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-elevated disabled:opacity-30 disabled:pointer-events-none text-copy-muted hover:text-copy-primary"
      >
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  );
}
