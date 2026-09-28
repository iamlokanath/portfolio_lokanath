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
    <div className="flex flex-wrap gap-2">
      {STARTER_CHIPS.map((chip) => (
        <button
          key={chip.id}
          type="button"
          disabled={disabled}
          onClick={() =>
            onSelect(chip.prompt, { jdMode: "jdMode" in chip && chip.jdMode === true })
          }
          className={cn(
            "text-left text-xs rounded-lg px-2.5 py-1.5",
            "bg-white/5 border border-white/10 text-zinc-300",
            "hover:bg-white/10 hover:border-white/20 transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
            "disabled:opacity-50"
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
