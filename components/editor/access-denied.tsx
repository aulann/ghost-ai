import { Lock } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AccessDenied() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <Lock className="h-8 w-8 text-copy-muted" />
      <div className="text-center">
        <p className="text-sm font-medium text-copy-primary">Access denied</p>
        <p className="mt-1 text-sm text-copy-muted">
          This project doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
      </div>
      <Link
        href="/editor"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Back to editor
      </Link>
    </div>
  );
}
