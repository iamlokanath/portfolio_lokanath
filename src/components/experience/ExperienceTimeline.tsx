"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { GlassCard } from "@/components/shared/GlassCard";
import experienceData from "@/data/experience.json";
import type { ExperienceItem } from "@/types/portfolio";
import { formatMonthYear } from "@/lib/content";
import { cn } from "@/lib/utils";

type ExperienceTimelineProps = {
  roles?: ExperienceItem[];
  highlightsTitle: string;
  highlights: string[];
  statusLabels: { current: string; previous: string };
  full?: boolean;
};

export function ExperienceTimeline({
  roles,
  highlightsTitle,
  highlights,
  statusLabels,
  full = false,
}: ExperienceTimelineProps) {
  const items =
    roles ?? (experienceData.experiences as ExperienceItem[]);

  return (
    <div className="grid min-w-0 lg:grid-cols-[1fr_280px] gap-8">
      <div className="relative">
        <div className="absolute left-[11px] top-3 bottom-3 w-px border-l border-dashed border-white/15" />
        <div className="space-y-10">
          {items.map((role, index) => {
            const isCurrent = role.to === "Present";
            return (
              <motion.article
                key={role.id}
                className="relative pl-10"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 bg-[#030712]",
                    isCurrent
                      ? "border-violet-400 shadow-[0_0_16px_rgba(139,92,246,0.45)]"
                      : "border-white/25"
                  )}
                />
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      isCurrent
                        ? "border-violet-400/30 bg-violet-500/15 text-violet-200"
                        : "border-white/10 bg-white/5 text-slate-400"
                    )}
                  >
                    {isCurrent ? statusLabels.current : statusLabels.previous}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatMonthYear(role.from)} – {formatMonthYear(role.to)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white break-words">
                  {role.role}{" "}
                  <span className="text-violet-300">@ {role.company}</span>
                </h3>
                {role.location ? (
                  <p className="mt-1 text-xs text-slate-500">{role.location}</p>
                ) : null}

                <div className="mt-5 space-y-6">
                  {full
                    ? role.projects.map((project) => (
                        <div key={project.name}>
                          <p className="text-sm font-medium text-white">{project.name}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {project.stack.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <ul className="mt-3 space-y-2">
                            {project.highlights.map((point) => (
                              <li
                                key={point}
                                className="flex gap-2 text-sm leading-relaxed text-slate-400"
                              >
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-400" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    : (
                        <ul className="space-y-2">
                          {role.projects
                            .flatMap((project) => project.highlights)
                            .slice(0, index === 0 ? 4 : 3)
                            .map((point) => (
                              <li
                                key={point}
                                className="flex gap-2 text-sm leading-relaxed text-slate-400"
                              >
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-400" />
                                <span>{point}</span>
                              </li>
                            ))}
                        </ul>
                      )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <GlassCard className="h-fit lg:sticky lg:top-28">
        <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
          {highlightsTitle}
        </h4>
        <ul className="mt-4 space-y-3">
          {highlights.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-slate-400">
              <Check size={16} className="mt-0.5 shrink-0 text-sky-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

export function PageIntro({
  eyebrow,
  heading,
  description,
}: {
  eyebrow: string;
  heading: string;
  description?: string;
}) {
  return (
    <div className="mb-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {heading}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ExperienceTimelineFrame({ children }: { children: ReactNode }) {
  return <Container className="max-w-6xl px-4 sm:px-6">{children}</Container>;
}
