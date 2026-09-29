"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/shared/Container";
import { AppIcon } from "@/components/shared/AppIcon";
import { GlowArc } from "@/components/shared/GlowArc";
import achievements from "@/data/content/achievements.json";
import { envOr } from "@/lib/env-public";

function NumberTicker({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^(.*?)(\d+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const suffix = match?.[3] ?? "";
  const target = match ? Number(match[2]) : 0;
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || !match) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCurrent(target);
      return;
    }

    const start = performance.now();
    const duration = 3200;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setCurrent(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target]);

  if (!match) return <span>{value}</span>;

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {current}
      {suffix}
    </span>
  );
}

export default function AchievementsSection() {
  const githubHref = envOr(
    achievements.githubCard.hrefEnvKey,
    achievements.githubCard.fallback
  );

  return (
    <section id="achievements" className="relative overflow-hidden px-4 sm:px-6 pt-8 pb-16 md:pb-20">
      <GlowArc className="-right-16 bottom-6 z-0 sm:-right-20" />
      <Container className="relative z-10 max-w-7xl">
        <div className="mb-6">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-400">
            {achievements.eyebrow}
          </p>
          <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-white tracking-tight">
            {achievements.heading}
          </h2>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {achievements.stats.map((stat) => (
            <article
              key={stat.id}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 px-4 py-4"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
                <AppIcon name={stat.icon} size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-lg font-bold text-white leading-none">
                  <NumberTicker value={stat.value} />
                </p>
                <p className="mt-1.5 text-[12px] leading-snug text-slate-400">{stat.label}</p>
              </div>
            </article>
          ))}

          <a
            href={githubHref}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-violet-400/30 bg-[#0b1220]/75 px-4 py-4 lg:col-span-1 shadow-[0_0_24px_rgba(139,92,246,0.2)] transition-colors hover:border-sky-400/40"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
              <AppIcon name="github" size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-tight">
                {achievements.githubCard.title}
              </p>
              <p className="mt-1 text-[12px] text-slate-400 leading-snug">
                {achievements.githubCard.subtitle}
              </p>
              <p className="mt-1.5 text-[12px] text-sky-400 truncate">
                {achievements.githubCard.handle} →
              </p>
            </div>
          </a>
        </div>
      </Container>
    </section>
  );
}
