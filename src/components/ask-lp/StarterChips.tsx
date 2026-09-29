"use client";

import { cn } from "@/lib/utils";

export const STARTER_CHIPS = [
  { id: "overview", label: "⚡ Give me a quick overview", prompt: "Give me a quick overview of Lokanath's background and experience." },
  { id: "stack", label: "💻 What's his strongest tech stack?", prompt: "What's his strongest tech stack, with project evidence?" },
  { id: "projects", label: "🚀 Show me his best projects", prompt: "Show me his strongest projects and why they matter." },
  { id: "ai", label: "🤖 What AI experience does he have?", prompt: "What AI experience does he have? Cite specific projects." },
  { id: "aws", label: "☁️ Tell me about his AWS experience", prompt: "Tell me about his AWS experience with concrete project examples." },
  { id: "jd", label: "🎯 Is he a fit for my role? (paste a JD)", prompt: "__JD_MODE__", jdMode: true },
  { id: "hire", label: "💼 Why should I hire him?", prompt: "Why should I hire Lokanath? Focus on verified strengths and outcomes." },
] as const;

type StarterChipsProps = {
  onSelect: (prompt: string, options?: { jdMode?: boolean }) => void;
  disabled?: boolean;
};

export default function StarterChips({ onSelect, disabled }: StarterChipsProps) {
  return (
    <div className="flex flex-col gap-2">
      {STARTER_CHIPS.map((chip) => (
        <button
          key={chip.id}
          type="button"
          disabled={disabled}
          onClick={() =>
            onSelect(chip.prompt, { jdMode: "jdMode" in chip && chip.jdMode === true })
          }
          className={cn(
            "w-full rounded-full border border-white/10 bg-[#0b1220]/80 px-3.5 py-2 text-left text-xs text-slate-200",
            "transition-colors hover:border-violet-400/40 hover:bg-violet-500/10",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
            "disabled:opacity-50"
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
