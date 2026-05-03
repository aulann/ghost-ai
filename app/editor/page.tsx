import { NewProjectButton } from "@/components/editor/new-project-button";

export default function EditorPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-base">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-lg font-medium text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
      </div>
      <NewProjectButton />
    </div>
  );
}
