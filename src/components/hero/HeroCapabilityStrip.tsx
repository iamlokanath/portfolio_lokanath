"use client";

import { AppIcon } from "@/components/shared/AppIcon";
import focusAreas from "@/data/content/focus-areas.json";
import type { FocusAreaItem } from "@/types/portfolio";
import { cn } from "@/lib/utils";

export function HeroCapabilityStrip() {
  const items = focusAreas.items as FocusAreaItem[];

  return (
    <div
      className={cn(
        "mt-12 md:mt-14 rounded-2xl border border-sky-500/15",
        "bg-[#0b1220]/60 backdrop-blur-xl",
        "shadow-[0_0_40px_rgba(56,189,248,0.06)]"
      )}
    >
      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex flex-1 gap-3.5 p-5 md:px-5 md:py-6",
              index < items.length - 1 && "border-b border-white/[0.06] lg:border-b-0 lg:border-r",
              index % 2 === 0 && index < items.length - 1 && "sm:border-r lg:border-r",
              index < 2 && "sm:border-b lg:border-b-0"
            )}
          >
            <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sky-300">
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/20 to-sky-500/10" />
              <AppIcon name={item.icon} size={18} className="relative" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-[12px] text-slate-400 leading-snug">
                {item.lines.join(", ")}
              </p>
              {item.description ? (
                <p className="mt-1.5 text-[12px] text-slate-500 leading-snug">
                  {item.description}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
