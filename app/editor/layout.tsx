"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";
import { ProjectDialogContext } from "@/context/project-dialog-context";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dialogs = useProjectDialogs();

  return (
    <ProjectDialogContext.Provider value={{ openCreate: dialogs.openCreate }}>
      <div className="flex h-screen flex-col overflow-hidden bg-base">
        <EditorNavbar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
        />
        <div className="relative flex flex-1 overflow-hidden">
          <ProjectSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onCreateProject={dialogs.openCreate}
            onRenameProject={dialogs.openRename}
            onDeleteProject={dialogs.openDelete}
          />
          <main className="flex flex-1 overflow-hidden">{children}</main>
        </div>
      </div>

      <CreateProjectDialog
        open={dialogs.mode === "create"}
        onClose={dialogs.close}
        name={dialogs.createName}
        onNameChange={dialogs.setCreateName}
        onConfirm={dialogs.handleCreate}
        loading={dialogs.loading}
      />
      <RenameProjectDialog
        open={dialogs.mode === "rename"}
        onClose={dialogs.close}
        project={dialogs.activeProject}
        name={dialogs.renameName}
        onNameChange={dialogs.setRenameName}
        onConfirm={dialogs.handleRename}
        loading={dialogs.loading}
      />
      <DeleteProjectDialog
        open={dialogs.mode === "delete"}
        onClose={dialogs.close}
        project={dialogs.activeProject}
        onConfirm={dialogs.handleDelete}
        loading={dialogs.loading}
      />
    </ProjectDialogContext.Provider>
  );
}
