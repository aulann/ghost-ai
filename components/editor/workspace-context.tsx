"use client";

import { createContext, useContext } from "react";

interface WorkspaceContextValue {
  setProjectName: (name: string | null) => void;
  aiOpen: boolean;
  toggleAi: () => void;
}

export const WorkspaceContext = createContext<WorkspaceContextValue>({
  setProjectName: () => {},
  aiOpen: false,
  toggleAi: () => {},
});

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
