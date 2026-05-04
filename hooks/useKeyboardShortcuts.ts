"use client";

import { useEffect } from "react";
interface ZoomControls {
  zoomIn(options?: { duration?: number }): void;
  zoomOut(options?: { duration?: number }): void;
}

interface UseKeyboardShortcutsOptions {
  rfInstance: ZoomControls | null;
  undo: () => void;
  redo: () => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts({ rfInstance, undo, redo }: UseKeyboardShortcutsOptions): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(e.target)) return;

      const isMod = e.metaKey || e.ctrlKey;

      if (!isMod) {
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          rfInstance?.zoomIn({ duration: 200 });
          return;
        }
        if (e.key === "-") {
          e.preventDefault();
          rfInstance?.zoomOut({ duration: 200 });
          return;
        }
        return;
      }

      if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if (e.key === "y" || e.key === "Y") {
        e.preventDefault();
        redo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rfInstance, undo, redo]);
}
