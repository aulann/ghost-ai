"use client";

import {
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import { useCallback, useContext, useRef, useState } from "react";
import { CanvasEdgeCallbacksCtx } from "./canvas-callbacks";
import type { CanvasEdge, CanvasNode } from "@/types/canvas";

const STROKE_DIM = "rgba(255,255,255,0.22)";
const STROKE_BRIGHT = "rgba(255,255,255,0.72)";
const ARROW_DIM = "rgba(255,255,255,0.28)";
const ARROW_BRIGHT = "rgba(255,255,255,0.80)";

export function CanvasEdgeRenderer({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<CanvasEdge>) {
  const [hovered, setHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const onEdgesChange = useContext(CanvasEdgeCallbacksCtx);
  const { getEdge } = useReactFlow<CanvasNode, CanvasEdge>();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 6,
  });

  const label = data?.label ?? "";
  const isActive = hovered || !!selected;
  const stroke = isActive ? STROKE_BRIGHT : STROKE_DIM;
  const dimMarkerId = `edge-arrow-dim-${id}`;
  const brightMarkerId = `edge-arrow-bright-${id}`;
  const markerId = isActive ? brightMarkerId : dimMarkerId;

  const updateLabel = useCallback(
    (newLabel: string) => {
      const edge = getEdge(id);
      if (!edge) return;
      onEdgesChange([
        {
          type: "replace",
          id,
          item: { ...edge, data: { ...(edge.data ?? {}), label: newLabel } },
        },
      ]);
    },
    [id, getEdge, onEdgesChange],
  );

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Enter" || e.key === "Escape") stopEditing();
    },
    [stopEditing],
  );

  const stopEvent = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <>
      <defs>
        <marker
          id={dimMarkerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={ARROW_DIM} />
        </marker>
        <marker
          id={brightMarkerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={ARROW_BRIGHT} />
        </marker>
      </defs>

      {/* wide transparent hit area for easy hover/click */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: "pointer" }}
      />

      {/* visible edge line */}
      <path
        d={edgePath}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
        style={{ transition: "stroke 0.15s ease", pointerEvents: "none" }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onMouseDown={stopEvent}
          onPointerDown={stopEvent}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={(e) => updateLabel(e.target.value)}
              onBlur={stopEditing}
              onKeyDown={handleKeyDown}
              onClick={stopEvent}
              placeholder="Label..."
              className="nodrag nopan rounded-full border border-surface-border bg-elevated px-2 py-0.5 text-xs text-copy-primary outline-none"
              style={{ minWidth: 48, width: Math.max(48, label.length * 7 + 32) }}
            />
          ) : label ? (
            <span className="cursor-pointer select-none rounded-full border border-surface-border bg-elevated px-2 py-0.5 text-xs text-copy-primary">
              {label}
            </span>
          ) : isActive ? (
            <span className="pointer-events-none select-none rounded-full border border-surface-border/30 bg-base/30 px-2 py-0.5 text-xs text-copy-primary/30">
              double-click to label
            </span>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
