"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { profileKnowledge } from "@/data/profile-knowledge";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage, { stripFollowups, type ThreadMessage } from "./ChatMessage";
import StarterChips from "./StarterChips";
import ContactCtaRow from "./ContactCtaRow";
import { parseJdMatch } from "./JdMatchCard";

type AskLpChatWindowProps = {
  open: boolean;
  onClose: () => void;
  onMinimize: () => void;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function track(event: string) {
  if (typeof window === "undefined") return;
  try {
    const key = "ask_lp_events";
    const raw = sessionStorage.getItem(key);
    const data = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    data[event] = (data[event] ?? 0) + 1;
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export default function AskLpChatWindow({ open, onClose, onMinimize }: AskLpChatWindowProps) {
  const reduceMotion = useReducedMotion();
  const panelId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jdMode, setJdMode] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, sending]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusables.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    panel.addEventListener("keydown", onTab);
    return () => panel.removeEventListener("keydown", onTab);
  }, [open]);

  const send = useCallback(
    async (text: string, options?: { jdAnalysis?: boolean }) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      const isJd = options?.jdAnalysis || jdMode;
      const userContent = isJd
        ? `Please analyze this job description for fit against Lokanath's verified profile. Give Strong Fit / Partial Fit / Limited Fit (no percentage), with strong matches, partial matches, gaps, and a recommended next step.\n\n${trimmed}`
        : trimmed;

      setError(null);
      setInput("");
      setJdMode(false);

      const userMsg: ThreadMessage = { id: uid(), role: "user", content: trimmed };
      const assistantId = uid();
      const assistantPlaceholder: ThreadMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        streaming: true,
        jdAnalysis: isJd,
      };

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
      setSending(true);

      const history: { role: "user" | "assistant"; content: string }[] = [
        ...messages,
        userMsg,
      ].map((m) => {
        if (m.role === "user" && m.id === userMsg.id) {
          return { role: "user", content: userContent };
        }
        if (m.role === "assistant") {
          return { role: "assistant", content: stripFollowups(m.content).body };
        }
        return { role: "user", content: m.content };
      });

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/ask-lp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok) {
          let msg =
            "I'm having trouble connecting right now. You can still explore the portfolio or download the resume directly.";
          try {
            const data = (await res.json()) as { error?: string };
            if (data.error) msg = data.error;
          } catch {
            /* use default */
          }
          setError(msg);
          setMessages((prev) => prev.filter((m) => m.id !== assistantId && m.id !== userMsg.id));
          return;
        }

        if (!res.body) {
          setError(
            "I'm having trouble connecting right now. You can still explore the portfolio or download the resume directly."
          );
          setMessages((prev) => prev.filter((m) => m.id !== assistantId && m.id !== userMsg.id));
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulated, streaming: true } : m
            )
          );
        }

        const { body, followUps } = stripFollowups(accumulated);
        const jdMatch = isJd ? parseJdMatch(body) : null;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: accumulated,
                  streaming: false,
                  followUps,
                  jdMatch,
                  jdAnalysis: isJd,
                }
              : m
          )
        );

        setShowCta((prev) => {
          const assistantCount =
            messages.filter((m) => m.role === "assistant").length + 1;
          return prev || assistantCount >= 2;
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(
          "I'm having trouble connecting right now. You can still explore the portfolio or download the resume directly."
        );
        setMessages((prev) => prev.filter((m) => m.id !== assistantId && m.id !== userMsg.id));
      } finally {
        setSending(false);
      }
    },
    [jdMode, messages, sending]
  );

  const onStarter = (prompt: string, options?: { jdMode?: boolean }) => {
    if (options?.jdMode) {
      track("starter_jd");
      setJdMode(true);
      setInput("");
      return;
    }
    track("starter_chip");
    void send(prompt);
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-[2px] md:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            id="ask-lp-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ask-lp-title"
            data-panel={panelId}
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={
              reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 28 }
            }
            className={cn(
              "fixed z-[60] flex flex-col overflow-hidden rounded-2xl border border-white/15",
              "bg-zinc-950/95 backdrop-blur-xl shadow-2xl shadow-black/50",
              "bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] left-[max(1.25rem,env(safe-area-inset-left))]",
              "h-[min(640px,calc(100dvh-5.5rem))] sm:left-auto sm:w-[420px]",
              "md:bottom-24 md:right-5 md:left-auto"
            )}
          >
            <ChatHeader minimized={false} onMinimize={onMinimize} onClose={onClose} />

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-3 min-h-0"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Hi, I&apos;m Loka&apos;s AI assistant. I can help you quickly understand his
                    experience, technical strengths, projects, and fit for your role.
                  </p>
                  <p className="text-xs text-zinc-500">Try asking:</p>
                  <StarterChips onSelect={onStarter} disabled={sending} />
                </div>
              ) : null}

              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  message={m}
                  onFollowUp={(q) => {
                    track("followup");
                    void send(q);
                  }}
                />
              ))}

              {sending && messages[messages.length - 1]?.content === "" ? (
                <div
                  className="mr-auto rounded-xl px-3 py-2 text-sm text-zinc-500 border border-white/10 bg-white/5 flex items-center gap-2"
                  aria-label="Assistant is typing"
                >
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:300ms]" />
                  </span>
                  Thinking…
                </div>
              ) : null}

              {showCta && !sending ? (
                <ContactCtaRow onTrack={(id) => track(`cta_${id}`)} />
              ) : null}
            </div>

            {error ? (
              <div className="px-4 pb-2 space-y-2" role="alert">
                <p className="text-xs text-red-400">{error}</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/projects"
                    className="text-[11px] rounded-lg px-2.5 py-1.5 bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10"
                  >
                    Explore Projects
                  </a>
                  <a
                    href={profileKnowledge.identity.resumeUrl}
                    download
                    className="text-[11px] rounded-lg px-2.5 py-1.5 bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10"
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            ) : null}

            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={() => void send(input, { jdAnalysis: jdMode })}
              disabled={sending}
              jdMode={jdMode}
            />
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
