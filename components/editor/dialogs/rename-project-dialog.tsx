"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Project } from "@/hooks/use-project-dialogs";

interface RenameProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  name: string;
  onNameChange: (v: string) => void;
  onConfirm: () => void;
  loading: boolean;
}

export function RenameProjectDialog({
  open,
  onClose,
  project,
  name,
  onNameChange,
  onConfirm,
  loading,
}: RenameProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent showCloseButton={false} className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          {project && (
            <DialogDescription>
              Renaming{" "}
              <span className="text-copy-secondary">{project.name}</span>
            </DialogDescription>
          )}
        </DialogHeader>
        <Input
          placeholder="Project name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim() && !loading) onConfirm();
          }}
          className="border-surface-border text-copy-primary"
          autoFocus
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!name.trim() || loading}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
