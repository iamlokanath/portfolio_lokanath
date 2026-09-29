"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import type { PortfolioProject } from "@/types/portfolio";

type ProjectCardProps = {
  project: PortfolioProject;
  openLabel: string;
};

export function ProjectCard({ project, openLabel }: ProjectCardProps) {
  const stack = (project.stack ?? []).slice(0, 4);
  const href = project.link || "/projects";
  const hasImage = Boolean(project.image);

  return (
    <GlassCard className="overflow-hidden p-0 group h-full flex flex-col">
      <div className="relative h-44 bg-gradient-to-br from-violet-600/35 via-indigo-700/25 to-slate-900">
        {hasImage ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover opacity-85 group-hover:opacity-95 transition-opacity"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
          <Link
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
            aria-label={`${openLabel} ${project.title}`}
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <p className="mt-2 text-sm text-[var(--color-text-muted)] line-clamp-3 flex-1">
          {project.description}
        </p>
        {stack.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {stack.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--color-border)] bg-white/5 px-2.5 py-0.5 text-[11px] text-[var(--color-text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </GlassCard>
  );
}
