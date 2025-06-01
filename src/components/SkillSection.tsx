'use client';
import React from 'react';
import Image from 'next/image';
import courseData from "@/data/my_skills.json";
import Link from 'next/link';
import { BackgroundGradient } from './ui/background-gradient';

const username: string = "Lokanath";

interface Skills {
  id: number;
  title: string;
  image: string; // Ensure the image property is defined
  isFeatured: boolean;
  category: string; // Add category to interface
}

function SkillSection() {
  const FeaturedCourses: Skills[] = courseData.skills.filter((skill: Skills) => skill.isFeatured);

  // Group skills by category
  const skillsByCategory = FeaturedCourses.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skills[]>);

  return (
    <div className='py-16 bg-gray-900'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className='text-base text-teal-600 font-semibold tracking-wide uppercase'>My Skills</h2>
          <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl'>Highlighting My Diverse Skillset</p>
          <p className="mt-4 text-lg text-gray-400">Technologies I work with</p>
        </div>

        <div className='mt-12'>
          {Object.keys(skillsByCategory).map((category) => (
            <div key={category} className="mb-12">
              <h3 className="text-2xl font-semibold text-white mb-6 border-b border-teal-600 pb-2">{category}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 justify-center">
                {skillsByCategory[category].map((skill: Skills) => (
                  <div
                    key={skill.id}
                    className="group relative flex justify-center transition-transform duration-300 hover:scale-110"
                    title={skill.title}
                  >
                    <BackgroundGradient className="flex flex-col rounded-xl w-full aspect-square bg-white dark:bg-zinc-900 overflow-hidden items-center justify-center p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className='flex items-center justify-center text-center'>
                        <Image
                          src={skill.image}
                          width={40}
                          height={40}
                          alt={skill.title}
                          className="object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </BackgroundGradient>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkillSection;
