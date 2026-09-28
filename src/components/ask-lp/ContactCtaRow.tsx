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
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
      <p className="text-xs text-zinc-300 font-medium">
        Interested in discussing an opportunity?
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target={link.id === "resume" ? undefined : "_blank"}
            rel={link.id === "resume" ? undefined : "noopener noreferrer"}
            download={link.id === "resume" ? true : undefined}
            onClick={() => onTrack?.(link.id)}
            className={cn(
              "text-[11px] rounded-lg px-2.5 py-1.5",
              "bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white",
              "border border-white/10 hover:opacity-95 transition-opacity",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            )}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
