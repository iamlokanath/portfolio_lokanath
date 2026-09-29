"use client";

import { AppIcon } from "@/components/shared/AppIcon";
import type { SocialLink } from "@/types/portfolio";
import { resolveSocialHref } from "@/lib/content";
import { cn } from "@/lib/utils";

type SocialLinksProps = {
  items: SocialLink[];
  className?: string;
  compact?: boolean;
};

export function SocialLinks({ items, className, compact = false }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center", compact ? "gap-2" : "gap-3", className)}>
      {items.map((s) => (
        <a
          key={s.id}
          href={resolveSocialHref(s)}
          target={s.isEmail ? undefined : "_blank"}
          rel={s.isEmail ? undefined : "noopener noreferrer"}
          aria-label={s.label}
          className={cn(
            "inline-flex items-center justify-center rounded-full border border-white/10 bg-[#0b1220]/90 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors",
            compact ? "h-8 w-8" : "h-10 w-10"
          )}
        >
          <AppIcon name={s.icon} size={compact ? 14 : 16} />
        </a>
      ))}
    </div>
  );
}
