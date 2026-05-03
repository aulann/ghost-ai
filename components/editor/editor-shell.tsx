"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import { ProjectDialogContext } from "@/components/editor/project-dialog-context";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const actions = useProjectActions();

  return (
    <ProjectDialogContext.Provider value={{ openCreate: actions.openCreate }}>
      <div className="flex h-screen flex-col overflow-hidden bg-base">
        <EditorNavbar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
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
    </ProjectDialogContext.Provider>
  );
}
