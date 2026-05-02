"use client";

import { useState } from "react";

export interface Project {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "collaborator";
}

type DialogMode = "create" | "rename" | "delete" | null;

export interface ProjectDialogsState {
  mode: DialogMode;
  activeProject: Project | null;
  createName: string;
  renameName: string;
  loading: boolean;
}

export interface ProjectDialogsActions {
  setCreateName: (v: string) => void;
  setRenameName: (v: string) => void;
  openCreate: () => void;
  openRename: (project: Project) => void;
  openDelete: (project: Project) => void;
  close: () => void;
  handleCreate: () => void;
  handleRename: () => void;
  handleDelete: () => void;
}

export function useProjectDialogs(): ProjectDialogsState & ProjectDialogsActions {
  const [mode, setMode] = useState<DialogMode>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setCreateName("");
    setMode("create");
  }

  function openRename(project: Project) {
    setActiveProject(project);
    setRenameName(project.name);
    setMode("rename");
  }

  function openDelete(project: Project) {
    setActiveProject(project);
    setMode("delete");
  }

  function close() {
    setMode(null);
    setActiveProject(null);
    setCreateName("");
    setRenameName("");
  }

  function handleCreate() {
    if (!createName.trim()) return;
    setLoading(true);
    setLoading(false);
    close();
  }

  function handleRename() {
    if (!renameName.trim()) return;
    setLoading(true);
    setLoading(false);
    close();
  }

  function handleDelete() {
    setLoading(true);
    setLoading(false);
    close();
  }

  return {
    mode,
    activeProject,
    createName,
    setCreateName,
    renameName,
    setRenameName,
    loading,
    openCreate,
    openRename,
    openDelete,
    close,
    handleCreate,
    handleRename,
    handleDelete,
  };
}
