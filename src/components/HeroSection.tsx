import React from 'react'
import Link from 'next/link'
import { Spotlight } from '@/components/ui/Spotlight'

import { Button } from "@/components/ui/moving-border";

import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
function HeroSection() {


  const words = [
    {
      text: "Build",
    },
    {
      text: "awesome",
    },
    {
      text: "websites",
    },
    {
      text: "with",
    },
    {
      text: "Lokanath.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];


  return (
    <div className="h-auto md:h-[40rem] w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto py-10 md:py-0">

        <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
        />

      <div className="p-4 relative z-10 w-full text-center mt-4">
        <h1
        className='mt-20 md:mt-0 text-4xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400'>Hello World! Welcome to my Portfolio</h1>

        <TypewriterEffectSmooth words={words} className='flex items-center  justify-center'/>
        <p
        className='mt-4 font-normal text-base md:text-lg text-neutral-300 max-w-xl mx-auto'>I am always seeking new opportunities to learn and grow, both personally and professionally. I believe in continuous improvement and staying up-to-date with the latest industry trends and technologies.

        I am a Full Stack Software Developer with expertise in Front-End, Back-End Development, DevOps, web scrapping, testing and Cloud Technologies. Feel free to connect with me to discuss about Software Development. I look forward to connecting with you!</p>
        <div className="mt-4">
            <Link href="Image/Lokanath_Panda_8144496407.pdf" target='_blank'>
            <Button
        borderRadius="1.75rem"
        className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        Resume
      </Button>
            </Link>
        </div>
      </div>
      </div>
  )
}

export default HeroSection
