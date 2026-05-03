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

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  name: string;
  onNameChange: (v: string) => void;
  roomIdPreview: string;
  onConfirm: () => void;
  loading: boolean;
}

export function CreateProjectDialog({
  open,
  onClose,
  name,
  onNameChange,
  roomIdPreview,
  onConfirm,
  loading,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent showCloseButton={false} className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Give your project a name to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Project name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && roomIdPreview && !loading) onConfirm();
            }}
            className="border-surface-border text-copy-primary"
            autoFocus
          />
          {roomIdPreview && (
            <p className="font-mono text-xs text-copy-secondary">{roomIdPreview}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!roomIdPreview || loading}>
            Create project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
