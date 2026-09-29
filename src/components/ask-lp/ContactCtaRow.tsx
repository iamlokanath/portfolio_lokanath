"use client";

import { profileKnowledge } from "@/data/profile-knowledge";
import { cn } from "@/lib/utils";

type ContactCtaRowProps = {
  onTrack?: (action: string) => void;
};

export default function ContactCtaRow({ onTrack }: ContactCtaRowProps) {
  const { resumeUrl, linkedin, github, whatsapp } = profileKnowledge.identity;

  const links = [
    { label: "Download Resume", href: resumeUrl, id: "resume" },
    { label: "Contact (WhatsApp)", href: whatsapp, id: "whatsapp" },
    { label: "LinkedIn", href: linkedin, id: "linkedin" },
    { label: "GitHub", href: github, id: "github" },
  ];

  return (
    <div className="space-y-2 rounded-2xl border border-white/[0.08] bg-[#0b1220] p-3">
      <p className="text-xs font-medium text-slate-200">
        Interested in discussing an opportunity?
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link, index) => (
          <a
            key={link.id}
            href={link.href}
            target={link.id === "resume" ? undefined : "_blank"}
            rel={link.id === "resume" ? undefined : "noopener noreferrer"}
            download={link.id === "resume" ? true : undefined}
            onClick={() => onTrack?.(link.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[11px] transition-opacity hover:opacity-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
              index === 0
                ? "bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white"
                : "border border-white/15 bg-white/[0.03] text-slate-200"
            )}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
