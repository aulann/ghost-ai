import type { Node, Edge } from "@xyflow/react";

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color?: string;
  shape?: string;
  width?: number;
  height?: number;
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;
export type CanvasEdge = Edge<Record<string, unknown>, "canvasEdge">;

export const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const;

export type NodeShape = (typeof NODE_SHAPES)[number];

export interface ShapeDefault {
  width: number;
  height: number;
}

export const SHAPE_DEFAULTS: Record<NodeShape, ShapeDefault> = {
  rectangle: { width: 160, height: 80 },
  diamond: { width: 180, height: 120 },
  circle: { width: 100, height: 100 },
  pill: { width: 160, height: 70 },
  cylinder: { width: 120, height: 100 },
  hexagon: { width: 140, height: 110 },
};

export const DEFAULT_NODE_COLOR = "#1F1F1F";
