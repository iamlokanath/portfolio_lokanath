"use client";

import { ArrowRight, Mail } from "lucide-react";
import { AppLinkButton } from "@/components/shared/AppLinkButton";
import { SocialLinks } from "@/components/shared/SocialLinks";
import type { HeroContent } from "@/types/portfolio";
import { cn } from "@/lib/utils";

type HeroContentProps = {
  data: HeroContent;
};

export function HeroContentBlock({ data }: HeroContentProps) {
  return (
    <div className="relative z-10 min-w-0">
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full",
          "border border-cyan-400/35 bg-[#0b1220]/80",
          "px-3.5 py-1.5 text-xs font-medium text-cyan-100/90"
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.95)]" />
        </span>
        {data.badge}
      </span>

      <h1 className="mt-5 text-[1.85rem] sm:text-5xl md:text-[3.25rem] font-bold tracking-tight leading-[1.12] break-words">
        <span className="block text-white">{data.greeting}</span>
        <span className="block bg-gradient-to-r from-[#a78bfa] via-[#818cf8] to-[#38bdf8] bg-clip-text text-transparent">
          {data.name}
        </span>
      </h1>

      <p className="mt-4 max-w-[34rem] text-[15px] sm:text-base text-slate-400 leading-relaxed">
        {data.bio}
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <AppLinkButton
          href={data.primaryCta.href}
          variant="primary"
          size="lg"
          className="h-11 w-full px-5 shadow-[0_0_28px_rgba(139,92,246,0.4)] sm:w-auto"
        >
          {data.primaryCta.label}
          <ArrowRight size={16} />
        </AppLinkButton>
        <AppLinkButton
          href={data.secondaryCta.href}
          variant="outline"
          size="lg"
          className="h-11 w-full px-5 border-white/20 text-slate-100 hover:bg-white/[0.04] sm:w-auto"
        >
          <Mail size={16} />
          {data.secondaryCta.label}
        </AppLinkButton>
      </div>

      <SocialLinks items={data.socials} className="mt-7" />
    </div>
  );
}
