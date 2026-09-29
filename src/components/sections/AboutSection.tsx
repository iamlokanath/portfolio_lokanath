"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { AppIcon } from "@/components/shared/AppIcon";
import about from "@/data/content/about.json";
import { envOr } from "@/lib/env-public";
import type { AboutContent, AboutFact } from "@/types/portfolio";

const data = about as AboutContent;

function FactRow({ fact }: { fact: AboutFact }) {
  const value = fact.valueEnvKey
    ? envOr(fact.valueEnvKey, fact.valueFallback ?? "")
    : (fact.value ?? "");

  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center text-violet-400">
        <AppIcon name={fact.icon} size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] text-slate-400 leading-none">{fact.label}</p>
        <p className="mt-1 text-sm font-medium text-white leading-snug break-words">
          {value}
        </p>
      </div>
    </li>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative section-pad">
      <Container className="relative z-10 max-w-6xl px-4 sm:px-6">
        <div className="grid min-w-0 items-stretch gap-10 lg:grid-cols-[1.15fr_1fr_1.05fr] lg:gap-0">
          <div className="lg:pr-10">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-400">
              {data.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl sm:text-[2.15rem] font-bold text-white tracking-tight leading-tight">
              {data.heading}
            </h2>
            <p className="mt-4 text-[15px] leading-[1.7] text-slate-400 max-w-md">
              {data.body}
            </p>
            <a
              href={data.cta.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-sky-500/40 px-5 py-2 text-sm text-white hover:bg-sky-500/10 transition-colors"
            >
              {data.cta.label}
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="lg:border-l lg:border-white/[0.08] lg:px-8 xl:px-10">
            <ul className="flex h-full flex-col justify-center gap-5">
              {data.facts.map((fact) => (
                <FactRow key={fact.id} fact={fact} />
              ))}
            </ul>
          </div>

          <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0a1220]/80 p-6 md:p-7 lg:ml-2">
            <p
              className="text-[3.25rem] leading-none text-sky-400 font-serif select-none"
              aria-hidden
            >
              &ldquo;
            </p>
            <blockquote className="mt-2 text-[15px] leading-relaxed text-slate-200">
              {data.quote.text}
            </blockquote>
            <p className="mt-auto pt-8 text-right font-script text-[1.65rem] leading-none text-sky-300">
              {data.quote.attribution}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
