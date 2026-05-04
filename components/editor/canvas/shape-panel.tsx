"use client";

import { Square, Diamond, Circle, Pill, Database, Hexagon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { NODE_SHAPES, SHAPE_DEFAULTS, type NodeShape } from "@/types/canvas";

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

export function ShapePanel() {
  function handleDragStart(e: React.DragEvent, shape: NodeShape) {
    const { width, height } = SHAPE_DEFAULTS[shape];
    const payload: ShapeDragPayload = { shape, width, height };
    e.dataTransfer.setData("application/ghost-shape", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-surface-border bg-surface px-3 py-2 shadow-lg">
      {NODE_SHAPES.map((shape) => {
        const Icon = SHAPE_ICONS[shape];
        return (
          <button
            key={shape}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            title={SHAPE_LABELS[shape]}
            className="flex h-9 w-9 cursor-grab items-center justify-center rounded-xl text-copy-muted transition-colors hover:bg-elevated hover:text-copy-primary active:cursor-grabbing"
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
