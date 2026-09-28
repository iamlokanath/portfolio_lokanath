"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import ProjectEvidenceCard, { findMentionedProjects } from "./ProjectEvidenceCard";
import JdMatchCard, { type JdMatchData } from "./JdMatchCard";

export type ChatRole = "user" | "assistant";

export type ThreadMessage = {
  id: string;
  role: ChatRole;
  content: string;
  streaming?: boolean;
  jdAnalysis?: boolean;
  jdMatch?: JdMatchData | null;
  followUps?: string[];
};

type ChatMessageProps = {
  message: ThreadMessage;
  onFollowUp?: (q: string) => void;
};

export function stripFollowups(raw: string): { body: string; followUps: string[] } {
  const match = raw.match(/<<<FOLLOWUPS>>>\s*([\s\S]*?)<<<END>>>/);
  if (!match) {
    return { body: raw.trim(), followUps: [] };
  }
  const body = raw.replace(/<<<FOLLOWUPS>>>[\s\S]*?<<<END>>>/, "").trim();
  const followUps = match[1]
    .split("\n")
    .map((l) => l.replace(/^[-*•\d.]+\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 4);
  return { body, followUps };
}

export default function ChatMessage({ message, onFollowUp }: ChatMessageProps) {
  const isUser = message.role === "user";
  const display = isUser ? message.content : stripFollowups(message.content).body;
  const followUps = message.followUps?.length
    ? message.followUps
    : !isUser && !message.streaming
      ? stripFollowups(message.content).followUps
      : [];
  const projects =
    !isUser && !message.streaming ? findMentionedProjects(display) : [];

  return (
    <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed",
          isUser
            ? "bg-blue-600/25 text-zinc-100 border border-blue-500/30"
            : "bg-white/5 text-zinc-200 border border-white/10"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{display}</p>
        ) : (
          <div className="ask-lp-md text-sm text-zinc-200 [&_p]:my-1.5 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_strong]:text-zinc-100 [&_a]:text-blue-400 [&_a]:underline-offset-2 hover:[&_a]:underline [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {display || (message.streaming ? "…" : "")}
            </ReactMarkdown>
          </div>
        )}
        {message.streaming ? (
          <span className="inline-block mt-1 h-1.5 w-1.5 rounded-full bg-zinc-400 animate-pulse" aria-hidden />
        ) : null}
      </div>

      {!isUser && !message.streaming && message.jdAnalysis && message.jdMatch ? (
        <div className="w-full max-w-[92%]">
          <JdMatchCard data={message.jdMatch} />
        </div>
      ) : null}

      {!isUser && !message.streaming && projects.length > 0 ? (
        <div className="w-full max-w-[92%] space-y-1">
          {projects.map((p) => (
            <ProjectEvidenceCard key={p.name} projectName={p.name} />
          ))}
        </div>
      ) : null}

      {!isUser && !message.streaming && followUps.length > 0 ? (
        <div className="flex flex-wrap gap-2 max-w-[92%] mt-1">
          {followUps.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onFollowUp?.(q)}
              className={cn(
                "text-left text-[11px] rounded-lg px-2.5 py-1.5",
                "bg-white/5 border border-white/10 text-zinc-400",
                "hover:bg-white/10 hover:text-zinc-200 transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              )}
            >
              {q}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
