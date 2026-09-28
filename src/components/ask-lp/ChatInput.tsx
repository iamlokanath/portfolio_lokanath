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
      className="border-t border-white/10 p-3 space-y-2 shrink-0"
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
              "flex-1 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white resize-y min-h-[80px] max-h-[160px]",
              "placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40",
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
              "flex-1 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white",
              "placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40",
              "disabled:opacity-50"
            )}
          />
        )}
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-medium text-white shrink-0",
            "bg-gradient-to-r from-blue-600 to-purple-600 border border-white/10",
            "disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          )}
        >
          Send
        </button>
      </div>
      <p className="text-[10px] text-zinc-500 text-center">
        Answers are grounded in Lokanath&apos;s real resume and project data.
      </p>
    </form>
  );
}
