'use client';

import React from 'react';
import { TracingBeam } from "@/components/ui/tracing-beam";
import experienceData from '@/data/experience.json';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function getDuration(from: string, to: string) {
  const start = new Date(from);
  const end = to === "Present" ? new Date() : new Date(to);
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  let result = '';
  if (years > 0) result += `${years} yr${years > 1 ? 's' : ''} `;
  if (months > 0) result += `${months} mo${months > 1 ? 's' : ''}`;
  return result.trim();
}

function formatDate(dateStr: string) {
  if (dateStr === "Present") return "Present";
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
}

function Experience() {
  return (
    <>
      <div className='p-12 bg-gray-900'>
        <div className="text-center">
          <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Experience</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">Professional Journey Thus Far</p>
        </div>
        <TracingBeam className="px-6">
          <div className="max-w-4xl mx-auto antialiased pt-4 relative mt-5">
            {experienceData.experiences.map((experience, index) => (
              <div key={`experience-${index}`} className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white hover:text-blue-400 transition-colors duration-300">
                      {experience.role}
                    </h3>
                    <p className="text-blue-400 font-medium mt-1">
                      {experience.company}
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {experience.type}
                    </span>
                    <div className="mt-2 text-sm text-gray-400 space-y-1">
                      <p>{formatDate(experience.from)} - {formatDate(experience.to)}</p>
                      <p className="text-blue-400">{getDuration(experience.from, experience.to)}</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm dark:prose-invert text-gray-300">
                  <ul className="space-y-3 list-none">
                    {experience.description.split('\n').map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 group/item">
                        <span className="text-blue-400 mt-1.5 group-hover/item:text-purple-400 transition-colors duration-300">→</span>
                        <span className="group-hover/item:text-white transition-colors duration-300">
                          {point.replace(/^\d+\.\s*/, '')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </TracingBeam>
      </div>
    </>
  );
}

export default Experience;
