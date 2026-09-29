"use client";

import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import journey from "@/data/content/journey.json";
import experienceData from "@/data/experience.json";
import type { ExperienceItem } from "@/types/portfolio";

export default function JourneySection() {
  const roles = (experienceData.experiences as ExperienceItem[]).slice(
    0,
    journey.maxRolesOnHome
  );

  return (
    <section id="experience" className="section-pad">
      <Container className="px-4 sm:px-6">
        <SectionHeader
          eyebrow={journey.eyebrow}
          heading={journey.heading}
          action={journey.viewAll}
        />
        <ExperienceTimeline
          roles={roles}
          highlightsTitle={journey.highlightsTitle}
          highlights={journey.highlights}
          statusLabels={journey.statusLabels}
        />
      </Container>
    </section>
  );
}
