"use client";

import { Container } from "@/components/shared/Container";
import { PageIntro } from "@/components/experience/ExperienceTimeline";
import { FeaturedProjectCard } from "@/components/projects/FeaturedProjectCard";
import pageCopy from "@/data/content/projects-page.json";
import projectsData from "@/data/projects.json";
import type { PortfolioProject } from "@/types/portfolio";

const tones = ["violet", "blue", "indigo", "emerald"];

export default function ProjectsPage() {
  const projects = projectsData.projects as PortfolioProject[];

  return (
    <main className="min-h-screen bg-site pt-32 pb-16">
      <Container className="max-w-7xl px-4 sm:px-6">
        <PageIntro
          eyebrow={pageCopy.eyebrow}
          heading={pageCopy.heading}
          description={`${projects.length} products, platforms, and experiments.`}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <FeaturedProjectCard
              key={project.id}
              card={{
                id: project.id,
                title: project.title,
                summary: project.description,
                stack: (project.stack ?? []).slice(0, 3),
                tone: tones[index % tones.length],
              }}
              project={project}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
