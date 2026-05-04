"use client";

import { createContext, useContext } from "react";

interface WorkspaceContextValue {
  setProjectName: (name: string | null) => void;
  aiOpen: boolean;
  toggleAi: () => void;
  templatesOpen: boolean;
  openTemplates: () => void;
  closeTemplates: () => void;
}

export const WorkspaceContext = createContext<WorkspaceContextValue>({
  setProjectName: () => {},
  aiOpen: false,
  toggleAi: () => {},
  templatesOpen: false,
  openTemplates: () => {},
  closeTemplates: () => {},
});

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
