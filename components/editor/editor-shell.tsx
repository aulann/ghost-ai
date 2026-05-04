"use client";

import { useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { ProjectShareDialog } from "@/components/editor/dialogs/project-share-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import { ProjectDialogContext } from "@/components/editor/project-dialog-context";
import { WorkspaceContext } from "@/components/editor/workspace-context";
import type { SaveStatus } from "@/hooks/use-canvas-autosave";
import type { Project } from "@/hooks/use-project-actions";

interface EditorShellProps {
  ownedProjects: Project[];
  sharedProjects: Project[];
  children: React.ReactNode;
}

export function EditorShell({
  ownedProjects,
  sharedProjects,
  children,
}: EditorShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workspaceProjectName, setWorkspaceProjectName] = useState<
    string | null
  >(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const actions = useProjectActions();
  const activeProjectId = pathname.startsWith("/editor/")
    ? pathname.split("/")[2] || null
    : null;

  // Store the canvas save function in a ref to avoid function-in-state issues.
  // CanvasFlow registers it via setTriggerSave; EditorNavbar calls triggerSave.
  const saveFnRef = useRef<(() => void) | null>(null);
  const setTriggerSave = useCallback((fn: (() => void) | null) => {
    saveFnRef.current = fn;
  }, []);
  const triggerSave = useCallback(() => saveFnRef.current?.(), []);

  return (
    <ProjectDialogContext.Provider value={{ openCreate: actions.openCreate }}>
      <WorkspaceContext.Provider
        value={{
          setProjectName: setWorkspaceProjectName,
          aiOpen,
          toggleAi: () => setAiOpen((v) => !v),
          templatesOpen,
          openTemplates: () => setTemplatesOpen(true),
          closeTemplates: () => setTemplatesOpen(false),
          saveStatus,
          setSaveStatus,
          setTriggerSave,
        }}
      >
        <div className="flex h-screen flex-col overflow-hidden bg-base">
          <EditorNavbar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((v) => !v)}
            projectName={workspaceProjectName}
            aiOpen={aiOpen}
            onAiToggle={() => setAiOpen((v) => !v)}
            onShareOpen={() => setShareOpen(true)}
            onTemplatesOpen={() => setTemplatesOpen(true)}
            saveStatus={saveStatus}
            onSave={triggerSave}
          />
          <div className="relative flex flex-1 overflow-hidden">
            <ProjectSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onCreateProject={actions.openCreate}
              onRenameProject={actions.openRename}
              onDeleteProject={actions.openDelete}
              ownedProjects={ownedProjects}
              sharedProjects={sharedProjects}
            />
            <main className="flex flex-1 overflow-hidden">{children}</main>
          </div>
        </div>

        <CreateProjectDialog
          open={actions.mode === "create"}
          onClose={actions.close}
          name={actions.createName}
          onNameChange={actions.setCreateName}
          roomIdPreview={actions.createRoomId}
          onConfirm={actions.handleCreate}
          loading={actions.loading}
        />
        <RenameProjectDialog
          open={actions.mode === "rename"}
          onClose={actions.close}
          project={actions.activeProject}
          name={actions.renameName}
          onNameChange={actions.setRenameName}
          onConfirm={actions.handleRename}
          loading={actions.loading}
        />
        <DeleteProjectDialog
          open={actions.mode === "delete"}
          onClose={actions.close}
          project={actions.activeProject}
          onConfirm={actions.handleDelete}
          loading={actions.loading}
        />
        <ProjectShareDialog
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          projectId={activeProjectId}
        />
      </WorkspaceContext.Provider>
    </ProjectDialogContext.Provider>
  );
}
