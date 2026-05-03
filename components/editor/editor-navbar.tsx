"use client";

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isOpen: boolean;
  onToggle: () => void;
  projectName?: string | null;
  aiOpen?: boolean;
  onAiToggle?: () => void;
  onShareOpen?: () => void;
}

export function EditorNavbar({
  isOpen,
  onToggle,
  projectName,
  aiOpen,
  onAiToggle,
  onShareOpen,
}: EditorNavbarProps) {
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
              onClick={onShareOpen}
              className="gap-1.5"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAiToggle}
              className={cn(
                "gap-1.5",
                aiOpen
                  ? "bg-ai-dim text-ai-text hover:bg-ai-dim"
                  : "text-copy-muted hover:bg-elevated hover:text-ai-text",
              )}
            >
              <Sparkles className="h-4 w-4" />
              AI
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </header>
  );
}
