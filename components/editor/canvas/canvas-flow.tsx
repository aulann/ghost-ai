"use client";

import { useState, useCallback } from "react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionMode,
  Panel,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  DEFAULT_NODE_COLOR,
  SHAPE_DEFAULTS,
  type CanvasNode,
  type CanvasEdge,
  type NodeShape,
} from "@/types/canvas";
import { CanvasNodeRenderer } from "./canvas-node";
import { ShapePanel } from "./shape-panel";

const nodeTypes = { canvasNode: CanvasNodeRenderer };

let nodeCounter = 0;
function nextNodeId(shape: string): string {
  return `${shape}-${Date.now()}-${++nodeCounter}`;
}

interface ShapeDragPayload {
  shape: NodeShape;
  width: number;
  height: number;
}

export function CanvasFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const [rfInstance, setRfInstance] =
    useState<ReactFlowInstance<CanvasNode, CanvasEdge> | null>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!rfInstance) return;

      const raw = e.dataTransfer.getData("application/ghost-shape");
      if (!raw) return;

      let payload: ShapeDragPayload;
      try {
        payload = JSON.parse(raw) as ShapeDragPayload;
      } catch {
        return;
      }

      const { shape, width, height } = payload;
      const position = rfInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const newNode: CanvasNode = {
        id: nextNodeId(shape),
        type: "canvasNode",
        position: {
          x: position.x - width / 2,
          y: position.y - height / 2,
        },
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR,
          shape,
          width,
          height,
        },
      };

      onNodesChange([{ type: "add", item: newNode }]);
    },
    [rfInstance, onNodesChange]
  );

  return (
    <ReactFlow<CanvasNode, CanvasEdge>
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDelete={onDelete}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      onInit={setRfInstance}
      onDragOver={onDragOver}
      onDrop={onDrop}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Panel position="bottom-center">
        <ShapePanel />
      </Panel>
    </ReactFlow>
  );
}
