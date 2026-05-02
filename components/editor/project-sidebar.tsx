"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { MOCK_PROJECTS } from "@/lib/mock-projects";
import type { Project } from "@/hooks/use-project-dialogs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  onCreateProject: () => void;
  onRenameProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

const ownedProjects = MOCK_PROJECTS.filter((p) => p.role === "owner");
const sharedProjects = MOCK_PROJECTS.filter((p) => p.role === "collaborator");

export function ProjectSidebar({
  isOpen,
  onClose,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-72 flex-col",
          "bg-surface border-r border-surface-border",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-surface-border px-4">
          <span className="text-sm font-medium text-copy-primary">Projects</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close project sidebar"
            className="h-7 w-7 text-copy-muted hover:text-copy-primary hover:bg-elevated"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          defaultValue="my-projects"
          className="flex min-h-0 flex-1 flex-col gap-3 px-3 pt-3"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="flex flex-1 flex-col gap-1 overflow-y-auto">
            {ownedProjects.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-center text-sm text-copy-muted">No projects yet.</p>
              </div>
            ) : (
              ownedProjects.map((project) => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  onRename={onRenameProject}
                  onDelete={onDeleteProject}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="shared" className="flex flex-1 flex-col gap-1 overflow-y-auto">
            {sharedProjects.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-center text-sm text-copy-muted">No shared projects.</p>
              </div>
            ) : (
              sharedProjects.map((project) => (
                <SharedProjectItem key={project.id} project={project} />
              ))
            )}
          </TabsContent>
        </Tabs>

        <div className="shrink-0 border-t border-surface-border p-3">
          <Button className="w-full gap-2" onClick={onCreateProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
    </>
  );
}

interface ProjectItemProps {
  project: Project;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function ProjectItem({ project, onRename, onDelete }: ProjectItemProps) {
  return (
    <div className="group flex cursor-pointer items-center gap-1 rounded-xl px-2 py-1.5 hover:bg-elevated">
      <span className="flex-1 truncate text-sm text-copy-primary">{project.name}</span>
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onRename(project)}
          aria-label={`Rename ${project.name}`}
          className="text-copy-muted hover:text-copy-primary"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => onDelete(project)}
          aria-label={`Delete ${project.name}`}
          className="text-copy-muted hover:text-error"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

interface SharedProjectItemProps {
  project: Project;
}

function SharedProjectItem({ project }: SharedProjectItemProps) {
  return (
    <div className="flex cursor-pointer items-center gap-1 rounded-xl px-2 py-1.5 hover:bg-elevated">
      <span className="flex-1 truncate text-sm text-copy-primary">{project.name}</span>
    </div>
  );
}
