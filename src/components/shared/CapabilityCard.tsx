"use client";

import { AppIcon } from "@/components/shared/AppIcon";
import { GlassCard } from "@/components/shared/GlassCard";
import type { FocusAreaItem } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const accentMap: Record<string, string> = {
  blue: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  purple: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  pink: "text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/20",
  indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
};

type CapabilityCardProps = {
  item: FocusAreaItem;
};

export function CapabilityCard({ item }: CapabilityCardProps) {
  return (
    <GlassCard className="hover:border-[var(--color-border-strong)] transition-colors h-full">
      <div
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-xl border mb-4",
          accentMap[item.accent] ?? accentMap.purple
        )}
      >
        <AppIcon name={item.icon} size={18} />
      </div>
      <h3 className="text-base font-semibold text-white">{item.title}</h3>
      {item.description ? (
        <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">
          {item.description}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-[var(--color-text-dim)] leading-relaxed">
        {item.lines.join(" · ")}
      </p>
    </GlassCard>
  );
}
