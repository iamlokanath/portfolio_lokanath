"use client";

import { Spotlight } from "@/components/ui/Spotlight";
import { Container } from "@/components/shared/Container";
import { HeroContentBlock } from "@/components/hero/HeroContent";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { HeroCapabilityStrip } from "@/components/hero/HeroCapabilityStrip";
import hero from "@/data/content/hero.json";
import type { HeroContent } from "@/types/portfolio";

export default function HeroSection() {
  const data = hero as HeroContent;

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-[6.25rem] md:pt-28 pb-10 md:pb-14"
    >
      <Spotlight className="-top-40 left-0 md:left-40 md:-top-20" fill="#a78bfa" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_20%,rgba(139,92,246,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_85%_30%,rgba(56,189,248,0.10),transparent_50%)]" />

      <Container className="relative z-10 max-w-7xl px-4 sm:px-6">
        <div className="grid min-w-0 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center">
          <div className="min-w-0">
            <HeroContentBlock data={data} />
          </div>
          <div className="min-w-0">
            <HeroVisual data={data.codeWindow} />
          </div>
        </div>
        <HeroCapabilityStrip />
      </Container>
    </section>
  );
}
