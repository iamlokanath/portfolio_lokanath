"use client";

import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

type SpeechRec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecEvent = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
};

function createRecognition(): SpeechRec | null {
  if (typeof window === "undefined") return null;
  const win = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  const Ctor = win.SpeechRecognition || win.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

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
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRec | null>(null);
  const baseRef = useRef(value);

  useEffect(() => {
    if (!listening) baseRef.current = value;
  }, [listening, value]);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  const toggleMic = () => {
    if (disabled) return;
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = createRecognition();
    if (!recognition) {
      setVoiceError("Voice input is not supported in this browser.");
      return;
    }

    setVoiceError(null);
    baseRef.current = value;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      let spoken = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        spoken += event.results[i][0]?.transcript ?? "";
      }
      const base = baseRef.current.trim();
      onChange(base ? `${base} ${spoken.trim()}` : spoken.trim());
    };
    recognition.onerror = () => {
      setVoiceError("Could not hear that. Try again.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

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
          type="button"
          onClick={toggleMic}
          disabled={disabled}
          aria-pressed={listening}
          aria-label={listening ? "Stop speaking" : "Speak your question"}
          className={cn(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border",
            listening
              ? "border-red-400/40 bg-red-500/15 text-red-300"
              : "border-white/10 bg-[#0c1526] text-slate-300 hover:text-white",
            "disabled:opacity-40"
          )}
        >
          <Mic size={16} />
        </button>
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
        {voiceError
          ? voiceError
          : listening
            ? "Listening… speak your question."
            : "Answers are grounded in Lokanath's real resume and project data."}
      </p>
    </form>
  );
}
