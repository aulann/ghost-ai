"use client";

import { useState } from "react";
import { Square, Diamond, Circle, Pill, Database, Hexagon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { NODE_SHAPES, SHAPE_DEFAULTS, DEFAULT_NODE_COLOR, type NodeShape } from "@/types/canvas";

interface ShapeDragPayload {
  shape: NodeShape;
  width: number;
  height: number;
}

const SHAPE_ICONS: Record<NodeShape, LucideIcon> = {
  rectangle: Square,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Database,
  hexagon: Hexagon,
};

const SHAPE_LABELS: Record<NodeShape, string> = {
  rectangle: "Rectangle",
  diamond: "Diamond",
  circle: "Circle",
  pill: "Pill",
  cylinder: "Cylinder",
  hexagon: "Hexagon",
};

interface DragState {
  shape: NodeShape;
  x: number;
  y: number;
}

const PREVIEW_FILL = DEFAULT_NODE_COLOR;
const PREVIEW_STROKE = "#3a3a42";

function PreviewShape({ shape, width, height }: { shape: NodeShape; width: number; height: number }) {
  if (shape === "diamond") {
    const cx = width / 2;
    const cy = height / 2;
    const pad = 0.75;
    const points = `${cx},${pad} ${width - pad},${cy} ${cx},${height - pad} ${pad},${cy}`;
    return (
      <svg width={width} height={height}>
        <polygon points={points} fill={PREVIEW_FILL} stroke={PREVIEW_STROKE} strokeWidth={1.5} />
      </svg>
    );
  }

  if (shape === "hexagon") {
    const cx = width / 2;
    const cy = height / 2;
    const rx = cx - 0.75;
    const ry = cy - 0.75;
    const angles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];
    const points = angles.map((a) => `${cx + rx * Math.cos(a)},${cy + ry * Math.sin(a)}`).join(" ");
    return (
      <svg width={width} height={height}>
        <polygon points={points} fill={PREVIEW_FILL} stroke={PREVIEW_STROKE} strokeWidth={1.5} />
      </svg>
    );
  }

  if (shape === "cylinder") {
    const cx = width / 2;
    const ellipseRY = Math.max(height * 0.15, 10);
    const sw = 1.5;
    const pad = sw / 2;
    return (
      <svg width={width} height={height}>
        <rect x={pad} y={ellipseRY} width={width - pad * 2} height={height - 2 * ellipseRY} fill={PREVIEW_FILL} stroke="none" />
        <line x1={pad} y1={ellipseRY} x2={pad} y2={height - ellipseRY} stroke={PREVIEW_STROKE} strokeWidth={sw} />
        <line x1={width - pad} y1={ellipseRY} x2={width - pad} y2={height - ellipseRY} stroke={PREVIEW_STROKE} strokeWidth={sw} />
        <ellipse cx={cx} cy={height - ellipseRY} rx={cx - pad} ry={ellipseRY - pad} fill={PREVIEW_FILL} stroke={PREVIEW_STROKE} strokeWidth={sw} />
        <ellipse cx={cx} cy={ellipseRY} rx={cx - pad} ry={ellipseRY - pad} fill={PREVIEW_FILL} stroke={PREVIEW_STROKE} strokeWidth={sw} />
      </svg>
    );
  }

  const borderRadius = shape === "circle" ? "50%" : shape === "pill" ? "9999px" : "10px";
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: PREVIEW_FILL,
        border: `1.5px solid ${PREVIEW_STROKE}`,
        borderRadius,
      }}
    />
  );
}

export function ShapePanel() {
  const [drag, setDrag] = useState<DragState | null>(null);

  function handleDragStart(e: React.DragEvent, shape: NodeShape) {
    const { width, height } = SHAPE_DEFAULTS[shape];
    const payload: ShapeDragPayload = { shape, width, height };
    e.dataTransfer.setData("application/ghost-shape", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
    // Replace browser's default ghost with a transparent 1×1 canvas so only our preview shows
    const blank = document.createElement("canvas");
    blank.width = 1;
    blank.height = 1;
    e.dataTransfer.setDragImage(blank, 0, 0);
    setDrag({ shape, x: e.clientX, y: e.clientY });
  }

  function handleDrag(e: React.DragEvent) {
    // clientX/Y are 0 when dragging outside the viewport
    if (e.clientX === 0 && e.clientY === 0) return;
    setDrag((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev));
  }

  function handleDragEnd() {
    setDrag(null);
  }

  return (
    <>
      {drag && (
        <div
          className="pointer-events-none fixed z-50 opacity-60"
          style={{
            left: drag.x - SHAPE_DEFAULTS[drag.shape].width / 2,
            top: drag.y - SHAPE_DEFAULTS[drag.shape].height / 2,
          }}
        >
          <PreviewShape
            shape={drag.shape}
            width={SHAPE_DEFAULTS[drag.shape].width}
            height={SHAPE_DEFAULTS[drag.shape].height}
          />
        </div>
      )}
      <div className="flex items-center gap-1 rounded-full border border-surface-border bg-surface px-3 py-2 shadow-lg">
        {NODE_SHAPES.map((shape) => {
          const Icon = SHAPE_ICONS[shape];
          return (
            <button
              key={shape}
              draggable
              onDragStart={(e) => handleDragStart(e, shape)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              title={SHAPE_LABELS[shape]}
              className="flex h-9 w-9 cursor-grab items-center justify-center rounded-xl text-copy-muted transition-colors hover:bg-elevated hover:text-copy-primary active:cursor-grabbing"
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </>
  );
}
