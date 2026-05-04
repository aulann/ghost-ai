"use client";

import { useState, useCallback } from "react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { useUndo, useRedo } from "@liveblocks/react";
import { CanvasCallbacksCtx, CanvasEdgeCallbacksCtx } from "./canvas-callbacks";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ConnectionMode,
  Panel,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { CanvasControlBar } from "./canvas-control-bar";

import {
  DEFAULT_NODE_COLOR,
  SHAPE_DEFAULTS,
  type CanvasNode,
  type CanvasEdge,
} from "@/types/canvas";
import { CanvasNodeRenderer } from "./canvas-node";
import { CanvasEdgeRenderer } from "./canvas-edge";
import { ShapePanel } from "./shape-panel";
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal";
import { useWorkspace } from "@/components/editor/workspace-context";
import type { CanvasTemplate } from "@/components/editor/starter-templates";

const nodeTypes = { canvasNode: CanvasNodeRenderer };
const edgeTypes = { canvasEdge: CanvasEdgeRenderer };
const defaultEdgeOptions = { type: "canvasEdge" } as const;

function nextNodeId(shape: string): string {
  return `${shape}-${crypto.randomUUID()}`;
}


export function CanvasFlow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    CanvasNode,
    CanvasEdge
  > | null>(null);

  const undo = useUndo();
  const redo = useRedo();
  const { templatesOpen, closeTemplates } = useWorkspace();

  useKeyboardShortcuts({ rfInstance, undo, redo });

  const handleImportTemplate = useCallback(
    (template: CanvasTemplate) => {
      const removeNodes = nodes.map((nd) => ({ type: "remove" as const, id: nd.id }));
      const removeEdges = edges.map((ed) => ({ type: "remove" as const, id: ed.id }));
      if (removeNodes.length) onNodesChange(removeNodes);
      if (removeEdges.length) onEdgesChange(removeEdges);
      onNodesChange(template.nodes.map((nd) => ({ type: "add" as const, item: nd })));
      onEdgesChange(template.edges.map((ed) => ({ type: "add" as const, item: ed })));
      closeTemplates();
      setTimeout(() => rfInstance?.fitView({ duration: 400 }), 100);
    },
    [nodes, edges, onNodesChange, onEdgesChange, rfInstance, closeTemplates],
  );

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

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return;
      }

      if (parsed === null || typeof parsed !== "object") return;
      const p = parsed as Record<string, unknown>;

      const shape = p.shape;
      const width = Math.floor(Number(p.width));
      const height = Math.floor(Number(p.height));

      const MAX_NODE_SIZE = 2000;
      if (
        typeof shape !== "string" ||
        !(shape in SHAPE_DEFAULTS) ||
        !Number.isFinite(width) ||
        width <= 0 ||
        width > MAX_NODE_SIZE ||
        !Number.isFinite(height) ||
        height <= 0 ||
        height > MAX_NODE_SIZE
      ) {
        return;
      }
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
    [rfInstance, onNodesChange],
  );

  return (
    <CanvasCallbacksCtx.Provider value={onNodesChange}>
      <CanvasEdgeCallbacksCtx.Provider value={onEdgesChange}>
      <StarterTemplatesModal
        open={templatesOpen}
        onClose={closeTemplates}
        onImport={handleImportTemplate}
      />
        <ReactFlow<CanvasNode, CanvasEdge>
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDelete={onDelete}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionMode={ConnectionMode.Loose}
          onInit={setRfInstance}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} />
          <Panel position="bottom-left">
            <CanvasControlBar rfInstance={rfInstance} />
          </Panel>
          <Panel position="bottom-center">
            <ShapePanel />
          </Panel>
        </ReactFlow>
      </CanvasEdgeCallbacksCtx.Provider>
    </CanvasCallbacksCtx.Provider>
  );
}
