"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

import { DEFAULT_NODE_COLOR, type CanvasNode } from "@/types/canvas";

export function CanvasNodeRenderer({ data }: NodeProps<CanvasNode>) {
  const { label, color, width = 160, height = 80 } = data;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: color ?? DEFAULT_NODE_COLOR,
      }}
      className="relative flex items-center justify-center rounded-xl border border-surface-border text-sm font-medium text-copy-primary"
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <span className="px-3 text-center leading-tight">{label}</span>
    </div>
  );
}
