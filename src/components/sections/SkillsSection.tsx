"use client";

import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { AppIcon } from "@/components/shared/AppIcon";
import { GlowArc } from "@/components/shared/GlowArc";
import skills from "@/data/content/skills.json";

export default function SkillsSection() {
  return (
    <section id="skills" className="relative overflow-hidden px-4 sm:px-6 pt-16 md:pt-20 pb-6">
      <GlowArc className="-left-20 bottom-2 z-0" />
      <Container className="relative z-10 max-w-7xl">
        <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-400">
              {skills.eyebrow}
            </p>
            <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {skills.heading}
            </h2>
          </div>
          <Link
            href={skills.viewAll.href}
            className="shrink-0 text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            {skills.viewAll.label} →
          </Link>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {skills.categories.map((category) => (
            <article
              key={category.id}
              className="rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 px-4 py-4 xl:col-span-1 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-[0_0_24px_rgba(139,92,246,0.18)]"
            >
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-300">
                  <AppIcon name={category.icon} size={15} />
                </span>
                <h3 className="text-sm font-semibold text-white leading-tight">
                  {category.title}
                </h3>
              </div>
              <div className="mt-3 space-y-0.5">
                {category.lines.map((line) => (
                  <p key={line} className="text-[12.5px] leading-snug text-slate-400">
                    {line}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
