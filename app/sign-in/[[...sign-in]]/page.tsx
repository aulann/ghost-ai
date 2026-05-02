import { SignIn } from "@clerk/nextjs";
import { Cpu, Share2, FileText } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 flex-col bg-surface border-r border-surface-border">
        <div className="flex items-center gap-2.5 p-8">
          <div className="h-8 w-8 rounded-md bg-brand shrink-0" />
          <span className="text-copy-primary font-semibold">
            Ghost AI
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-14 pb-8">
          <h1 className="text-copy-primary font-bold text-4xl leading-[1.15] tracking-tight mb-4">
            Design systems at the
            <br />
            speed of thought.
          </h1>
          <p className="text-copy-secondary leading-relaxed mb-12 max-w-md">
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>

          <ul className="space-y-7">
            <li className="flex items-start gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-elevated shrink-0 mt-0.5">
                <Cpu className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="text-copy-primary font-medium text-sm">
                  AI Architecture Generation
                </p>
                <p className="text-copy-muted text-sm mt-1 leading-relaxed">
                  Describe your system, AI maps it to nodes and edges on a live
                  canvas.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-elevated shrink-0 mt-0.5">
                <Share2 className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="text-copy-primary font-medium text-sm">
                  Real-time Collaboration
                </p>
                <p className="text-copy-muted text-sm mt-1 leading-relaxed">
                  Live cursors, presence indicators, and shared node editing
                  across your team.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-elevated shrink-0 mt-0.5">
                <FileText className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="text-copy-primary font-medium text-sm">
                  Instant Spec Generation
                </p>
                <p className="text-copy-muted text-sm mt-1 leading-relaxed">
                  Export a complete Markdown technical spec directly from the
                  canvas graph.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="p-8">
          <p className="text-copy-muted text-xs">
            © 2026 Ghost AI. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-base">
        <SignIn />
      </div>
    </main>
  );
}
