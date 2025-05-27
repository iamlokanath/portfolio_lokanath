import React from 'react'
import { HeroParallax } from "@/components/ui/hero-parallax";
import projectData from '@/data/projects.json';

function Projects() {
  // Map projects.json to the format expected by HeroParallax
  const products = projectData.projects.map((project: any) => ({
    title: project.title,
    link: project.link,
    thumbnail: project.image // use 'image' as 'thumbnail'
  }));

  return (
    <div>
      <HeroParallax products={products} />
    </div>
  )
}

export default Projects
