// import Experience from "@/components/Experience";
import HeroSection from "@/components/HeroSection";
import Projects from "@/components/Projects";
import SkillSection from "@/components/SkillSection";


export default function Home() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
     <HeroSection/>
     {/* <Experience/> */}
     <Projects/>
     <SkillSection/>
    </main>
  );
}
