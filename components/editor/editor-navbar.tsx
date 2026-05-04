"use client";

import {
  AlertCircle,
  Check,
  LayoutTemplate,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Share2,
  Sparkles,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { SaveStatus } from "@/hooks/use-canvas-autosave";

interface EditorNavbarProps {
  isOpen: boolean;
  onToggle: () => void;
  projectName?: string | null;
  aiOpen?: boolean;
  onAiToggle?: () => void;
  onShareOpen?: () => void;
  onTemplatesOpen?: () => void;
  saveStatus?: SaveStatus;
  onSave?: () => void;
}

export function EditorNavbar({
  isOpen,
  onToggle,
  projectName,
  aiOpen,
  onAiToggle,
  onShareOpen,
  onTemplatesOpen,
  saveStatus,
  onSave,
}: EditorNavbarProps) {
  const isSaving = saveStatus === "saving";
  const isSaved = saveStatus === "saved";
  const isError = saveStatus === "error";

  return (
    <header className="flex h-12 shrink-0 items-center border-b border-surface-border bg-surface px-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label={isOpen ? "Close project sidebar" : "Open project sidebar"}
          className="h-8 w-8 shrink-0 text-copy-muted hover:bg-elevated hover:text-copy-primary"
        >
          {isOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>

        {projectName && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight text-copy-primary">
              {projectName}
            </p>
            <p className="text-xs leading-tight text-copy-muted">Workspace</p>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {projectName && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className={cn(
                "w-22 gap-1.5",
                isSaved && "border-brand/50 text-brand",
                isError && "border-red-500/50 text-red-400",
              )}
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isSaved && <Check className="h-3.5 w-3.5" />}
              {isError && <AlertCircle className="h-3.5 w-3.5" />}
              {!isSaving && !isSaved && !isError && (
                <Save className="h-3.5 w-3.5" />
              )}
              {isSaving ? "Saving…" : isSaved ? "Saved" : isError ? "Error" : "Save"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onTemplatesOpen}
              className="gap-1.5"
            >
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onShareOpen}
              className="gap-1.5"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={onAiToggle}
              aria-pressed={!!aiOpen}
              className="gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              AI
            </Button>
          </>
        )}
        {!projectName && <UserButton />}
      </div>
    </header>
  );
}
