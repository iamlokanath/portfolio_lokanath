"use client";

import { Container } from "@/components/shared/Container";
import {
  ExperienceTimeline,
  PageIntro,
} from "@/components/experience/ExperienceTimeline";
import journey from "@/data/content/journey.json";

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-site pt-32 pb-16">
      <Container className="max-w-6xl px-4 sm:px-6">
        <PageIntro
          eyebrow={journey.eyebrow}
          heading={journey.heading}
          description="Roles, projects, and the work behind each one."
        />
        <ExperienceTimeline
          highlightsTitle={journey.highlightsTitle}
          highlights={journey.highlights}
          statusLabels={journey.statusLabels}
          full
        />
      </Container>
    </main>
  );
}
