"use client";

import { Copy, Mail, Trash2, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type ProjectCollaborator,
  useProjectShare,
} from "@/hooks/use-project-share";

interface ProjectShareDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string | null;
}

function getInitial(email: string, displayName: string | null) {
  const source = displayName?.trim() || email.trim();
  return source.charAt(0).toUpperCase();
}

function CollaboratorAvatar({
  collaborator,
}: {
  collaborator: ProjectCollaborator;
}) {
  if (collaborator.avatarUrl) {
    return (
      <img
        src={collaborator.avatarUrl}
        alt={collaborator.displayName ?? collaborator.email}
        className="h-12 w-12 rounded-full border border-surface-border object-cover"
      />
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-border bg-subtle text-sm font-medium text-copy-secondary">
      {getInitial(collaborator.email, collaborator.displayName)}
    </div>
  );
}

function AccessRoleChip({ role }: { role: ProjectCollaborator["role"] }) {
  if (role === "owner") {
    return (
      <span className="inline-flex h-7 items-center rounded-full border border-brand/30 bg-brand-dim px-3 text-[0.65rem] font-semibold tracking-[0.22em] text-brand">
        OWNER
      </span>
    );
  }

  return (
    <span className="inline-flex h-7 items-center rounded-full border border-surface-border bg-subtle px-3 text-[0.65rem] font-semibold tracking-[0.22em] text-copy-faint">
      COLLABORATOR
    </span>
  );
}

function SurfaceCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.65rem] border border-surface-border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-4">
      {children}
    </div>
  );
}

export function ProjectShareDialog({
  open,
  onClose,
  projectId,
}: ProjectShareDialogProps) {
  const {
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
  } = useProjectShare(projectId, open);

  const isOwner = viewerRole === "owner";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-3xl border border-surface-border bg-[linear-gradient(180deg,var(--bg-surface),var(--bg-base))] p-0 text-copy-primary shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:max-w-[34.5rem]"
      >
        <div className="border-b border-surface-border px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <DialogHeader className="gap-1">
              <DialogTitle className="text-[1.05rem] font-semibold text-copy-primary">
                Share project
              </DialogTitle>
              <DialogDescription className="text-[0.95rem] text-copy-muted">
                {isOwner
                  ? "Invite collaborators, copy the workspace link, and manage access."
                  : "View who currently has access to this workspace."}
              </DialogDescription>
            </DialogHeader>

            <DialogClose
              render={
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-copy-muted transition-colors hover:bg-subtle hover:text-copy-primary"
                  aria-label="Close share dialog"
                />
              }
            >
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5">
          {isOwner && (
            <>
              <SurfaceCard>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[1.02rem] font-medium text-copy-primary">
                      Workspace link
                    </p>
                    <p className="mt-1 text-sm text-copy-muted">
                      Share a direct link with teammates after you grant them access.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleCopyLink()}
                    className="h-10 rounded-xl border-surface-border bg-base px-4 text-copy-primary hover:bg-subtle"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied!" : "Copy link"}
                  </Button>
                </div>
              </SurfaceCard>

              <SurfaceCard>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-copy-faint" />
                    <Input
                      value={inviteEmail}
                      onChange={(event) => setInviteEmail(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && inviteEmail.trim() && !inviting) {
                          void handleInvite();
                        }
                      }}
                      placeholder="teammate@company.com"
                      className="h-11 rounded-2xl border-surface-border bg-base pr-4 pl-11 text-copy-primary placeholder:text-copy-faint"
                      autoFocus
                    />
                  </div>

                  <Button
                    onClick={() => void handleInvite()}
                    disabled={!inviteEmail.trim() || inviting}
                    className="h-11 rounded-2xl bg-brand px-5 text-primary-foreground hover:bg-brand/90 sm:min-w-24"
                  >
                    Invite
                  </Button>
                </div>
              </SurfaceCard>
            </>
          )}

          <div className="flex items-center justify-between">
            <p className="text-[1rem] font-medium text-copy-primary">
              People with access
            </p>
            <p className="text-sm text-copy-faint">
              {collaborators.length} total
            </p>
          </div>

          <ScrollArea className="max-h-80">
            <div className="flex flex-col gap-3">
              {loading ? (
                <SurfaceCard>
                  <p className="text-center text-sm text-copy-muted">
                    Loading people with access...
                  </p>
                </SurfaceCard>
              ) : collaborators.length === 0 ? (
                <SurfaceCard>
                  <p className="text-center text-sm text-copy-muted">
                    No collaborators yet.
                  </p>
                </SurfaceCard>
              ) : (
                collaborators.map((collaborator) => {
                  const displayName = collaborator.displayName ?? collaborator.email;

                  return (
                    <div
                      key={collaborator.id}
                      className="flex items-center gap-3 rounded-[1.65rem] border border-surface-border bg-[linear-gradient(90deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-4 py-4"
                    >
                      <CollaboratorAvatar collaborator={collaborator} />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-[1rem] font-medium text-copy-primary">
                            {displayName}
                          </p>
                          <AccessRoleChip role={collaborator.role} />
                        </div>
                        <p className="mt-1 truncate text-sm text-copy-muted">
                          {collaborator.email}
                        </p>
                      </div>

                      {isOwner && collaborator.role === "collaborator" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => void handleRemove(collaborator.id)}
                          disabled={removingId === collaborator.id}
                          aria-label={`Remove ${collaborator.email}`}
                          className="h-9 w-9 rounded-full text-copy-faint hover:bg-subtle hover:text-error"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {error && <p className="text-sm text-error">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
