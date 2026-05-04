"use client";

import { useEffect } from "react";

import { useWorkspace } from "@/components/editor/workspace-context";
import { CanvasWrapper } from "@/components/editor/canvas/canvas-wrapper";
import { AiSidebar } from "@/components/editor/ai-sidebar";

interface WorkspaceShellProps {
  projectName: string;
  roomId: string;
}

export function WorkspaceShell({ projectName, roomId }: WorkspaceShellProps) {
  const { setProjectName, aiOpen, toggleAi } = useWorkspace();

  useEffect(() => {
    setProjectName(projectName);
    return () => setProjectName(null);
  }, [projectName, setProjectName]);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <CanvasWrapper roomId={roomId} projectId={roomId} />
      </div>
      <AiSidebar isOpen={aiOpen} onClose={toggleAi} />
    </div>
  );
}
