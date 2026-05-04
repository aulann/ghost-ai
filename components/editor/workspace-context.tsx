"use client";

import { createContext, useContext } from "react";
import type { SaveStatus } from "@/hooks/use-canvas-autosave";

interface WorkspaceContextValue {
  setProjectName: (name: string | null) => void;
  aiOpen: boolean;
  toggleAi: () => void;
  templatesOpen: boolean;
  openTemplates: () => void;
  closeTemplates: () => void;
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
  setTriggerSave: (fn: (() => void) | null) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextValue>({
  setProjectName: () => {},
  aiOpen: false,
  toggleAi: () => {},
  templatesOpen: false,
  openTemplates: () => {},
  closeTemplates: () => {},
  saveStatus: "idle",
  setSaveStatus: () => {},
  setTriggerSave: () => {},
});

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
