"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface Project {
  id: string;
  name: string;
  role: "owner" | "collaborator";
}

type DialogMode = "create" | "rename" | "delete" | null;

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function shortId(): string {
  return Math.random().toString(36).slice(2, 7);
}

export function useProjectActions() {
  const router = useRouter();
  const pathname = usePathname();

  const [mode, setMode] = useState<DialogMode>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [createName, setCreateName] = useState("");
  const [createSuffix, setCreateSuffix] = useState("");
  const [renameName, setRenameName] = useState("");
  const [loading, setLoading] = useState(false);

  const slug = toSlug(createName);
  const createRoomId = slug ? `${slug}-${createSuffix}` : "";

  function openCreate() {
    setCreateName("");
    setCreateSuffix(shortId());
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

  async function handleCreate() {
    if (!createName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName.trim() }),
      });
      if (!res.ok) return;
      const project = (await res.json()) as { id: string };
      close();
      router.push(`/editor/${project.id}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleRename() {
    if (!renameName.trim() || !activeProject) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameName.trim() }),
      });
      if (!res.ok) return;
      close();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!activeProject) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      });
      if (!res.ok) return;
      const isActive = pathname === `/editor/${activeProject.id}`;
      close();
      if (isActive) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    mode,
    activeProject,
    createName,
    setCreateName,
    createRoomId,
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
