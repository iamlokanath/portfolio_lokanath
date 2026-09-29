"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PortfolioProject } from "@/types/portfolio";
import { resolveProjectImage } from "@/lib/project-image";
import { cn } from "@/lib/utils";

type FeaturedCardData = {
  id: number;
  title: string;
  summary: string;
  stack: string[];
  tone: string;
};

const tones: Record<string, string> = {
  violet: "from-violet-600/40 via-indigo-900/20 to-[#070b14]",
  blue: "from-sky-600/35 via-blue-950/30 to-[#070b14]",
  indigo: "from-indigo-500/35 via-violet-950/20 to-[#070b14]",
  emerald: "from-emerald-500/35 via-teal-950/25 to-[#070b14]",
};

type FeaturedProjectCardProps = {
  card: FeaturedCardData;
  project?: PortfolioProject;
};

export function FeaturedProjectCard({ card, project }: FeaturedProjectCardProps) {
  const href = project?.link || "/projects";
  const external = href.startsWith("http");
  const image = resolveProjectImage(project?.image);
  const cardRef = useRef<HTMLElement>(null);

  const onMove = (event: MouseEvent<HTMLElement>) => {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / 18;
    const y = (event.clientY - rect.top - rect.height / 2) / 18;
    node.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d" }}
      className="group relative flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0b1220]/80 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition-transform duration-200 [transform:rotateY(0deg)] hover:border-violet-400/30"
    >
      <div
        className={cn(
          "relative h-[132px] overflow-hidden rounded-xl bg-gradient-to-br",
          tones[card.tone] ?? tones.violet
        )}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
            <p className="text-lg font-semibold tracking-wide text-white/90">
              {card.title.split("/")[0].trim()}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
        <h3 className="pr-8 text-[15px] font-semibold text-white leading-snug">
          {card.title}
        </h3>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {card.stack.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-slate-400 line-clamp-3 pr-10">
          {card.summary}
        </p>
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={`Open ${card.title}`}
          className="absolute bottom-3.5 right-3.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10 text-violet-200 transition-colors hover:bg-violet-500/20 hover:text-white"
        >
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
