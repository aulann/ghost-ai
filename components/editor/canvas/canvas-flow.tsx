"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { useUndo, useRedo, useUpdateMyPresence } from "@liveblocks/react";
import { useCanvasAutosave } from "@/hooks/use-canvas-autosave";
import { useWorkspace } from "@/components/editor/workspace-context";
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
import { PresenceAvatars } from "./presence-avatars";
import { LiveCursors } from "./live-cursors";
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal";
import type { CanvasTemplate } from "@/components/editor/starter-templates";

const nodeTypes = { canvasNode: CanvasNodeRenderer };
const edgeTypes = { canvasEdge: CanvasEdgeRenderer };
const defaultEdgeOptions = { type: "canvasEdge" } as const;

function nextNodeId(shape: string): string {
  return `${shape}-${crypto.randomUUID()}`;
}

// Pre-populate top-level width/height/style so ReactFlow knows node dimensions
// immediately and doesn't need to measure the DOM — prevents the elastic edge jump.
function withDimensions(n: CanvasNode): CanvasNode {
  const w = n.width ?? n.data.width;
  const h = n.height ?? n.data.height;
  if (w == null || h == null) return n;
  return {
    ...n,
    width: w,
    height: h,
    style: { ...n.style, width: w, height: h },
  };
}

interface CanvasFlowProps {
  projectId: string;
}

export function CanvasFlow({ projectId }: CanvasFlowProps) {
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
  const rfInstanceRef = useRef(rfInstance);
  rfInstanceRef.current = rfInstance;

  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const edgesRef = useRef(edges);
  edgesRef.current = edges;

  const undo = useUndo();
  const redo = useRedo();
  const updateMyPresence = useUpdateMyPresence();
  const { templatesOpen, closeTemplates, setSaveStatus, setTriggerSave } =
    useWorkspace();

  // Normalize legacy handle IDs and load saved canvas once on mount
  const initialLoadDone = useRef(false);
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    // Remap handle IDs that predate Feature 16 (target-*/source-* → handle-*)
    const legacyHandleMap: Record<string, string> = {
      "target-top": "handle-top",
      "target-right": "handle-right",
      "target-bottom": "handle-bottom",
      "target-left": "handle-left",
      "source-top": "handle-top",
      "source-right": "handle-right",
      "source-bottom": "handle-bottom",
      "source-left": "handle-left",
    };
    const edgesToFix = edges.filter(
      (e) =>
        (e.sourceHandle && legacyHandleMap[e.sourceHandle]) ||
        (e.targetHandle && legacyHandleMap[e.targetHandle]),
    );
    if (edgesToFix.length > 0) {
      onEdgesChange(
        edgesToFix.map((e) => ({
          type: "replace" as const,
          id: e.id,
          item: {
            ...e,
            sourceHandle: e.sourceHandle
              ? (legacyHandleMap[e.sourceHandle] ?? e.sourceHandle)
              : e.sourceHandle,
            targetHandle: e.targetHandle
              ? (legacyHandleMap[e.targetHandle] ?? e.targetHandle)
              : e.targetHandle,
          },
        })),
      );
    }

    // If room already has content, skip loading from blob
    if (nodes.length > 0 || edges.length > 0) return;

    fetch(`/api/projects/${projectId}/canvas`)
      .then((r) => (r.ok ? r.json() : { nodes: [], edges: [] }))
      .then((data: { nodes?: CanvasNode[]; edges?: CanvasEdge[] }) => {
        // Re-check live refs — a collaborator may have added content while the fetch was in flight
        if (nodesRef.current.length > 0 || edgesRef.current.length > 0) return;
        const savedNodes = Array.isArray(data.nodes) ? data.nodes : [];
        const savedEdges = Array.isArray(data.edges) ? data.edges : [];
        if (savedNodes.length === 0 && savedEdges.length === 0) return;
        if (savedNodes.length > 0) {
          onNodesChange(
            savedNodes.map((n) => ({
              type: "add" as const,
              item: withDimensions(n),
            })),
          );
        }

        const remapHandle = (handle?: string | null) =>
          handle ? (legacyHandleMap[handle] ?? handle) : handle;

        if (savedEdges.length > 0) {
          onEdgesChange(
            savedEdges.map((e) => ({
              type: "add" as const,
              item: {
                ...e,
                sourceHandle: remapHandle(e.sourceHandle),
                targetHandle: remapHandle(e.targetHandle),
              },
            })),
          );
        }
        setTimeout(
          () => rfInstanceRef.current?.fitView({ duration: 400 }),
          150,
        );
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { save } = useCanvasAutosave({
    projectId,
    nodes,
    edges,
    onStatusChange: setSaveStatus,
  });

  useEffect(() => {
    setTriggerSave(save);
    return () => setTriggerSave(null);
  }, [save, setTriggerSave]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!rfInstance) return;
      const { x, y } = rfInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });
      updateMyPresence({ cursor: { x, y } });
    },
    [rfInstance, updateMyPresence],
  );

  const handleMouseLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  useKeyboardShortcuts({ rfInstance, undo, redo });

  const handleImportTemplate = useCallback(
    (template: CanvasTemplate) => {
      const removeNodes = nodes.map((nd) => ({
        type: "remove" as const,
        id: nd.id,
      }));
      const removeEdges = edges.map((ed) => ({
        type: "remove" as const,
        id: ed.id,
      }));
      if (removeNodes.length) onNodesChange(removeNodes);
      if (removeEdges.length) onEdgesChange(removeEdges);
      onNodesChange(
        template.nodes.map((nd) => ({
          type: "add" as const,
          item: withDimensions(nd),
        })),
      );
      onEdgesChange(
        template.edges.map((ed) => ({ type: "add" as const, item: ed })),
      );
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
        !Object.prototype.hasOwnProperty.call(SHAPE_DEFAULTS, shape) ||
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

      const newNode: CanvasNode = withDimensions({
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
      });

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
          deleteKeyCode={["Backspace", "Delete"]}
          onInit={setRfInstance}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} />
          <Panel position="top-right">
            <PresenceAvatars />
          </Panel>
          <Panel position="bottom-left">
            <CanvasControlBar rfInstance={rfInstance} />
          </Panel>
          <Panel position="bottom-center">
            <ShapePanel />
          </Panel>
          <LiveCursors />
        </ReactFlow>
      </CanvasEdgeCallbacksCtx.Provider>
    </CanvasCallbacksCtx.Provider>
  );
}
