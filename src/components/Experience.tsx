"use client";
import React from 'react'
import { TracingBeam } from "@/components/ui/tracing-beam";
import experienceData from '@/data/experience.json';
function Experience() {
  return (
       <>
      <div className=' p-12 bg-gray-900'>
        <div className="text-center">
          <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Experirnece</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">Professional Journey Thus Far</p>
        </div>
        <TracingBeam className="px-6">
          <div className="max-w-2xl mx-auto antialiased pt-4 relative mt-5">

          {experienceData.experiences.map((experience) => (
            
              <div className="mb-10">
                <h2 className=" text-blue-500 rounded-full text-sm w-fit mb-1">
                  {experience.company}
                </h2>

                <p className="text-xl text-purple-500">
                  {experience.role}
                </p>
                <p className="mb-4 text-orange-500">
                  {experience.type}, {experience.year}
                </p>

                <div className="text-sm  prose prose-sm dark:prose-invert text-gray-400">

                  {experience.description}
                </div>
              </div>
            ))}
          </div>
        </TracingBeam>
      </div>
    </>
  )
}

export default Experience
