"use client";

import { useEffect } from "react";
import { Bot, Settings2, Sparkles, Workflow } from "lucide-react";

import { useWorkspace } from "@/components/editor/workspace-context";

interface WorkspaceShellProps {
  projectName: string;
}

export function WorkspaceShell({ projectName }: WorkspaceShellProps) {
  const { setProjectName, aiOpen } = useWorkspace();

  useEffect(() => {
    setProjectName(projectName);
    return () => setProjectName(null);
  }, [projectName, setProjectName]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-base">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-surface-border bg-elevated">
          <Workflow className="h-8 w-8 text-copy-muted" />
        </div>
        <div className="max-w-md text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-copy-faint">
            Workspace Shell
          </p>
          <h2 className="mb-3 text-2xl font-semibold text-copy-primary">
            Canvas and collaboration tooling land here next.
          </h2>
          <p className="text-sm leading-relaxed text-copy-muted">
            This room is ready for the shared architecture canvas, durable AI
            workflows, and real-time presence. For now, the shell is wired with
            project context and navigation only.
          </p>
        </div>
      </div>

      {aiOpen && (
        <div className="flex w-80 shrink-0 flex-col border-l border-surface-border bg-surface">
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-surface-border px-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ai-text" />
              <div>
                <p className="text-sm font-medium leading-tight text-copy-primary">
                  Ai Copilot
                </p>
                <p className="text-xs leading-tight text-copy-muted">
                  Placeholder panel
                </p>
              </div>
            </div>
            <Settings2 className="h-4 w-4 text-copy-muted" />
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto p-3">
            <div className="rounded-xl border border-surface-border bg-elevated p-3">
              <div className="mb-2 flex items-center gap-2">
                <Bot className="h-4 w-4 text-copy-muted" />
                <p className="text-sm font-medium text-copy-primary">
                  Chat surface pending
                </p>
              </div>
              <p className="text-xs leading-relaxed text-copy-muted">
                The toggle is wired. Messaging and generation are intentionally
                out of scope here.
              </p>
            </div>

            <div className="px-1">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-copy-faint">
                Future Hooks
              </p>
              <div className="rounded-xl border border-surface-border bg-elevated p-3">
                <p className="text-xs leading-relaxed text-copy-muted">
                  Prompt composer, run status, and architecture guidance will
                  attach to this sidebar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
