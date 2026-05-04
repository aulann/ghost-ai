"use client";

import { useEffect, useRef, useState } from "react";

export interface ProjectCollaborator {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: ViewerRole;
}

type ViewerRole = "owner" | "collaborator";

interface CollaboratorsResponse {
  viewerRole: ViewerRole;
  collaborators: ProjectCollaborator[];
}

export function useProjectShare(projectId: string | null, open: boolean) {
  const [viewerRole, setViewerRole] = useState<ViewerRole | null>(null);
  const [collaborators, setCollaborators] = useState<ProjectCollaborator[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open || !projectId) {
      setViewerRole(null);
      setCollaborators([]);
      return;
    }

    let active = true;

    async function loadCollaborators() {
      setViewerRole(null);
      setCollaborators([]);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/projects/${projectId}/collaborators`);
        const payload = (await response.json().catch(() => null)) as
          | CollaboratorsResponse
          | { error?: string }
          | null;

        if (!response.ok) {
          throw new Error(
            payload && "error" in payload && payload.error
              ? payload.error
              : "Unable to load collaborators",
          );
        }

        if (!active || !payload || !("collaborators" in payload)) {
          return;
        }

        setViewerRole(payload.viewerRole);
        setCollaborators(payload.collaborators);
      } catch (err) {
        if (!active) {
          return;
        }

        setError(err instanceof Error ? err.message : "Unable to load collaborators");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCollaborators();

    return () => {
      active = false;
    };
  }, [open, projectId]);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  async function handleInvite() {
    if (!projectId || !inviteEmail.trim()) {
      return;
    }

    setInviting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });

      const payload = (await response.json().catch(() => null)) as
        | CollaboratorsResponse
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          payload && "error" in payload && payload.error
            ? payload.error
            : "Unable to invite collaborator",
        );
      }

      if (!payload || !("collaborators" in payload)) {
        throw new Error("Unable to invite collaborator");
      }

      setViewerRole(payload.viewerRole);
      setCollaborators(payload.collaborators);
      setInviteEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to invite collaborator");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(collaboratorId: string) {
    if (!projectId) {
      return;
    }

    setRemovingId(collaboratorId);
    setError(null);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        {
          method: "DELETE",
        },
      );

      const payload = (await response.json().catch(() => null)) as
        | CollaboratorsResponse
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          payload && "error" in payload && payload.error
            ? payload.error
            : "Unable to remove collaborator",
        );
      }

      if (!payload || !("collaborators" in payload)) {
        throw new Error("Unable to remove collaborator");
      }

      setViewerRole(payload.viewerRole);
      setCollaborators(payload.collaborators);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove collaborator");
    } finally {
      setRemovingId(null);
    }
  }

  async function handleCopyLink() {
    if (!projectId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        new URL(`/editor/${projectId}`, window.location.origin).toString(),
      );

      setCopied(true);

      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }

      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setError("Unable to copy the project link");
    }
  }

  function reset() {
    setError(null);
    setInviteEmail("");
    setCopied(false);
  }

  return {
    viewerRole,
    collaborators,
    inviteEmail,
    setInviteEmail,
    loading,
    inviting,
    removingId,
    error,
    copied,
    handleInvite,
    handleRemove,
    handleCopyLink,
    reset,
  };
}
