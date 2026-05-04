"use client";

import { useState, useRef } from "react";
import { Bot, X, Download, FileText } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTER_CHIPS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
];

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: text },
    ]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "72px";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "72px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  function handleChip(chip: string) {
    setInput(chip);
    if (textareaRef.current) {
      textareaRef.current.style.height = "72px";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
      textareaRef.current.focus();
    }
  }

  return (
    <div
      className={cn(
        "absolute inset-y-0 right-0 z-20 flex w-80 flex-col",
        "border-l border-surface-border shadow-2xl backdrop-blur-sm",
        "bg-base/95",
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-surface-border px-4">
        <div className="flex items-center gap-2.5">
          <Bot className="h-4 w-4 text-ai-text" />
          <div>
            <p className="text-sm font-semibold leading-tight text-copy-primary">
              AI Workspace
            </p>
            <p className="text-xs leading-tight text-copy-muted">
              Collaborate with Ghost AI
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-copy-muted transition-colors hover:text-copy-primary"
          aria-label="Close AI sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="architect"
        className="flex flex-1 flex-col overflow-hidden"
      >
        <TabsList className="mx-3 mt-3 h-9 w-auto shrink-0 rounded-xl bg-subtle p-1">
          <TabsTrigger
            value="architect"
            className="flex-1 rounded-lg px-3 text-xs text-copy-muted data-active:bg-ai-dim data-active:text-ai-text"
          >
            AI Architect
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="flex-1 rounded-lg px-3 text-xs text-copy-muted data-active:bg-ai-dim data-active:text-ai-text"
          >
            Specs
          </TabsTrigger>
        </TabsList>

        {/* AI Architect Tab */}
        <TabsContent
          value="architect"
          className="mt-0 flex flex-1 flex-col overflow-hidden"
        >
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <Bot className="h-8 w-8 text-copy-muted" />
                <p className="text-sm font-medium text-copy-primary">
                  Ghost AI Architect
                </p>
                <p className="text-xs leading-relaxed text-copy-muted">
                  Describe a system and AI will generate the architecture on
                  your canvas.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2">
                {STARTER_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChip(chip)}
                    className="rounded-xl bg-subtle px-3 py-2 text-left text-xs text-ai-text transition-colors hover:bg-elevated"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 px-3 py-3">
              <div className="flex flex-col gap-3">
                {messages.map((msg) =>
                  msg.role === "user" ? (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl border-2 border-brand/50 bg-brand-dim px-3 py-2 text-xs text-copy-primary">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl border border-surface-border bg-elevated px-3 py-2 text-xs text-ai-text">
                        {msg.content}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </ScrollArea>
          )}

          {/* Input area */}
          <div className="shrink-0 border-t border-surface-border p-3">
            <div className="flex flex-col gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe a system architecture..."
                className="min-h-[72px] max-h-[160px] resize-none overflow-y-auto rounded-xl border-surface-border bg-elevated text-xs text-copy-primary placeholder:text-copy-muted"
                rows={3}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-full rounded-xl bg-ai text-xs text-white hover:bg-ai/90 disabled:opacity-40"
              >
                Send
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Specs Tab */}
        <TabsContent
          value="specs"
          className="mt-0 flex flex-1 flex-col overflow-hidden p-3"
        >
          <Button className="mb-4 w-full rounded-xl bg-ai text-xs text-white hover:bg-ai/90">
            Generate Spec
          </Button>

          {/* Demo spec card */}
          <div className="rounded-2xl border border-surface-border bg-elevated p-4">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-copy-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-tight text-copy-primary">
                  E-Commerce Backend
                </p>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-copy-muted">
                  RESTful API with product catalog, cart management, order
                  processing, and payment gateway integration...
                </p>
                <button
                  disabled
                  className="mt-3 flex cursor-not-allowed items-center gap-1.5 text-xs text-copy-faint"
                  aria-label="Download spec (unavailable)"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
