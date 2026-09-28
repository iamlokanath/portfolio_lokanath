import React from 'react'
import { HeroParallax } from "@/components/ui/hero-parallax";
import projectData from '@/data/projects.json';

function Projects() {
  const products = projectData.projects
    .filter((project: { image?: string }) => Boolean(project.image))
    .map((project: { title: string; link: string; image: string }) => ({
      title: project.title,
      link: project.link || "#",
      thumbnail: project.image,
    }));

  return (
    <div>
      <HeroParallax products={products} />
    </div>
  )
}

export default Projects
