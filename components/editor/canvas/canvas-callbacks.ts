import { createContext } from "react";
import type { OnNodesChange, OnEdgesChange } from "@xyflow/react";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

export const CanvasCallbacksCtx = createContext<OnNodesChange<CanvasNode>>(() => {});
export const CanvasEdgeCallbacksCtx = createContext<OnEdgesChange<CanvasEdge>>(() => {});
