"use client";

import { cn } from "@/lib/utils";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  jdMode?: boolean;
};

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = "Ask anything about Lokanath…",
  jdMode,
}: ChatInputProps) {
  return (
    <form
      className="shrink-0 space-y-2 border-t border-white/[0.08] bg-[#070b14]/80 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {jdMode ? (
        <p className="text-[11px] text-amber-300/90">
          JD mode — paste the job description (or key requirements), then send.
        </p>
      ) : null}
      <div className="flex gap-2 items-end">
        <label htmlFor="ask-lp-input" className="sr-only">
          Message
        </label>
        {jdMode ? (
          <textarea
            id="ask-lp-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste job description here…"
            disabled={disabled}
            maxLength={6000}
            rows={4}
            className={cn(
              "flex-1 rounded-2xl bg-[#0c1526] border border-white/10 px-3 py-2 text-sm text-slate-100 resize-y min-h-[80px] max-h-[160px]",
              "placeholder:text-slate-500 focus:outline-none focus:border-violet-400/50",
              "disabled:opacity-50"
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
        ) : (
          <input
            id="ask-lp-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={6000}
            autoComplete="off"
            className={cn(
              "h-11 flex-1 rounded-full bg-[#0c1526] border border-white/10 px-4 text-sm text-slate-100",
              "placeholder:text-slate-500 focus:outline-none focus:border-violet-400/50",
              "disabled:opacity-50"
            )}
          />
        )}
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={cn(
            "h-11 rounded-full px-5 text-sm font-medium text-white shrink-0",
            "bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] shadow-[0_0_20px_rgba(139,92,246,0.35)]",
            "disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          )}
        >
          Send
        </button>
      </div>
      <p className="text-center text-[10px] text-slate-500">
        Answers are grounded in Lokanath&apos;s real resume and project data.
      </p>
    </form>
  );
}
