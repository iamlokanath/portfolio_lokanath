"use client";

import { Container } from "@/components/shared/Container";
import { CapabilityCard } from "@/components/shared/CapabilityCard";
import focusAreas from "@/data/content/focus-areas.json";
import type { FocusAreaItem } from "@/types/portfolio";

export default function FocusAreasSection() {
  const items = focusAreas.items as FocusAreaItem[];

  return (
    <section className="section-pad pt-2 md:pt-4" aria-label="Capabilities">
      <Container className="px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <CapabilityCard key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
