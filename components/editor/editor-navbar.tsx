"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function EditorNavbar({ isOpen, onToggle }: EditorNavbarProps) {
  return (
    <header className="h-12 flex items-center px-3 bg-surface border-b border-surface-border shrink-0">
      <div className="flex items-center w-1/3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label={isOpen ? "Close project sidebar" : "Open project sidebar"}
          className="h-8 w-8 text-copy-muted hover:text-copy-primary hover:bg-elevated"
        >
          {isOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center" />
      <div className="flex items-center justify-end w-1/3">
        <UserButton />
      </div>
    </header>
  );
}
