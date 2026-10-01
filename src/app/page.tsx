import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import JourneySection from "@/components/sections/JourneySection";
import FeaturedProjectsSection from "@/components/sections/FeaturedProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import GitHubAnalyticsSection from "@/components/sections/GitHubAnalyticsSection";
import LinkedInPostsSection from "@/components/sections/LinkedInPostsSection";
import ContactSection from "@/components/sections/ContactSection";
import NameHoverSection from "@/components/sections/NameHoverSection";
import { GlowArc } from "@/components/shared/GlowArc";

export default function Home() {
  return (
    <main className="relative min-h-screen max-w-full overflow-x-clip bg-site">
      <GlowArc className="-left-16 top-4 z-0 sm:-left-20 sm:top-2" />
      <HeroSection />
      <AboutSection />
      <JourneySection />
      <FeaturedProjectsSection />
      <SkillsSection />
      <GitHubAnalyticsSection />
      <LinkedInPostsSection />
      <ContactSection />
      <NameHoverSection />
    </main>
  );
}
