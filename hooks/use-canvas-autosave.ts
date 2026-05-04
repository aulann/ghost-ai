import { useCallback, useEffect, useRef } from "react";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseCanvasAutosaveOptions {
  projectId: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onStatusChange: (status: SaveStatus) => void;
}

export function useCanvasAutosave({
  projectId,
  nodes,
  edges,
  onStatusChange,
}: UseCanvasAutosaveOptions): { save: () => Promise<void> } {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef(false);

  // Always-current refs so the stable save() never closes over stale values
  const onStatusChangeRef = useRef(onStatusChange);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const projectIdRef = useRef(projectId);

  useEffect(() => { onStatusChangeRef.current = onStatusChange; });
  useEffect(() => { nodesRef.current = nodes; });
  useEffect(() => { edgesRef.current = edges; });
  useEffect(() => { projectIdRef.current = projectId; });

  // Core save logic — serialized: if a save is already in flight, mark pending
  // and return; the in-flight save will re-run with the latest state on completion.
  const doSave = useRef(async () => {
    if (isSavingRef.current) {
      pendingSaveRef.current = true;
      return;
    }
    isSavingRef.current = true;
    onStatusChangeRef.current("saving");
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    try {
      const res = await fetch(`/api/projects/${projectIdRef.current}/canvas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes: nodesRef.current, edges: edgesRef.current }),
      });
      if (!res.ok) throw new Error("Save failed");
      onStatusChangeRef.current("saved");
    } catch {
      onStatusChangeRef.current("error");
    }
    isSavingRef.current = false;
    resetTimerRef.current = setTimeout(() => onStatusChangeRef.current("idle"), 2000);
    if (pendingSaveRef.current) {
      pendingSaveRef.current = false;
      doSave.current();
    }
  });

  // Manual save — cancels any pending debounce; if a save is in flight, mark
  // pending so the latest state is saved as soon as the current one completes.
  const save = useCallback(async () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (isSavingRef.current) {
      pendingSaveRef.current = true;
      return;
    }
    await doSave.current();
  }, []);

  // Debounced autosave on nodes/edges change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      doSave.current();
    }, 2000);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, projectId]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return { save };
}
