import React from 'react'
import { HeroParallax } from "@/components/ui/hero-parallax";
import projectData from '@/data/projects.json';


function Projects() {

  
  const products = [
    {
      title: "Gcek Naval Ncc",
      link: "https://gceknavalncc.netlify.app/",
      thumbnail:
        "/projects/navalncc.png",
    },
    {
      title: "Romi finance",
      link: "romifinanceassignment.netlify.app/",
      thumbnail:
        "/projects/romi.png",
    },
    {
      title: "Pacific Quotes",
      link: "pacific-quotes.netlify.app",
      thumbnail:
        "/projects/quotes.png",
    },
   
    {
      title: "Income",
      link: "retirement-strategy.netlify.app/",
      thumbnail:
        "/projects/income.png",
    },
    {
      title: "Farewell",
      link: "cse24farewell.netlify.app/",
      thumbnail:
        "/projects/farewell.png",
    },
    {
      title: "Cyber Fiesta",
      link: "https://github.com/iamlokanath/cyberfiesta-2024-events",
      thumbnail:
        "/projects/cyberfiesta.png",
    },
   
    {
      title: "Pacific Weather",
      link: "https://pacific-weather.netlify.app/",
      thumbnail:
        "/projects/weather.png",
    },
    
    {
      title: "Music App",
      link: "https://github.com/iamlokanath/nextJs",
      thumbnail:
        "/projects/music.png",
    },
   
    
    {
      title: "Full Stack Auth",
      link: "https://github.com/iamlokanath/nextjs-fullstack-auth",
      thumbnail:
        "/projects/auth.png",
    },
    {
      title: "GCEK Folio",
      link: "https://www.figma.com/file/eUr7lrhTBSDF6bRqwwQW84/GcekFolio?type=design&mode=design&t=Tlo5C3ICIBofFFMF-0",
      thumbnail:
        "/projects/gcekfolio.png",
    },
    {
      title: "Gcek Naval Ncc",
      link: "https://gceknavalncc.netlify.app/",
      thumbnail:
        "/projects/navalncc.png",
    },
    {
      title: "GCEK Folio",
      link: "https://www.figma.com/file/eUr7lrhTBSDF6bRqwwQW84/GcekFolio?type=design&mode=design&t=Tlo5C3ICIBofFFMF-0",
      thumbnail:
        "/projects/gcekfolio.png",
    },
    
   
    {
      title: "Pacific Quotes",
      link: "pacific-quotes.netlify.app",
      thumbnail:
        "/projects/quotes.png",
    },
   
    {
      title: "Romi finance",
      link: "romifinanceassignment.netlify.app/",
      thumbnail:
        "/projects/romi.png",
    },
    {
      title: "Cyber Fiesta",
      link: "https://github.com/iamlokanath/cyberfiesta-2024-events",
      thumbnail:
        "/projects/cyberfiesta.png",
    },
  ];



  
  return (
    <div>
      <HeroParallax products={products} />;
    </div>
  )
}

export default Projects
