"use client";

import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { FeaturedProjectCard } from "@/components/projects/FeaturedProjectCard";
import featured from "@/data/content/featured-projects.json";
import projectsData from "@/data/projects.json";
import type { PortfolioProject } from "@/types/portfolio";

export default function FeaturedProjectsSection() {
  const all = projectsData.projects as PortfolioProject[];

  return (
    <section id="projects" className="section-pad">
      <Container className="max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-400">
              {featured.eyebrow}
            </p>
            <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {featured.heading}
            </h2>
          </div>
          <Link
            href={featured.viewAll.href}
            className="shrink-0 text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            {featured.viewAll.label} →
          </Link>
        </div>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featured.cards.map((card) => {
            const project = all.find((item) => item.id === card.id);
            return (
              <FeaturedProjectCard
                key={card.id}
                card={card}
                project={project}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
