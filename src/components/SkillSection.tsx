'use client'
import React, { use } from 'react'
import courseData from "@/data/my_skills.json";
import Link from 'next/link';
import { BackgroundGradient } from './ui/background-gradient';

const username: string = "Lokanath";

interface Skills {
  id: number,
  title: string,
  image: string,
  isFeatured: boolean,
}

function SkillSection() {

    const FeaturedCourses = courseData.skills.filter((skill: Skills) => skill.isFeatured)


  return (
    <div className='py-12 bg-gray-900'>
      <div>
        <div className="text-center">
          <h2 className='text-base text-teal-600 font-semibold tracking-wide uppercase'>My Skills</h2>
          <p className='mt-2 text-3xl leasing-8 font-extrabold tracking-tight text-white sm:text-4xl'>Highlighting My Diverse Skillset</p>
        </div>
      </div>


      <div
        className='mt-10 flex items-center justify-center ml-5 mr-5'>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-10 gap-8 justify-center">

          {FeaturedCourses.map((skill: Skills) => (
            <div key={skill.id} className="flex justify-center">
              <BackgroundGradient className="flex flex-col rounded-full w-full h-full bg-white dark:bg-zinc-900 overflow-hidden items-center justify-center text-center">
                <div className='flex items-center justify-center text-center'>
                  <img
                    src={skill.image}
                    width="50"  
                    alt={skill.title}
                    className="object-cover"
                  />
                </div>
              </BackgroundGradient>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default SkillSection
