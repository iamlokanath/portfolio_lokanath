import React from 'react';
import { TracingBeam } from "@/components/ui/tracing-beam";
import experienceData from '@/data/experience.json';

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
          <div className="max-w-2xl mx-auto antialiased pt-4 relative mt-5">
            {experienceData.experiences.map((experience, index) => (
              <div key={`experience-${index}`} className="mb-10">
                <h2 className="text-blue-500 rounded-full text-sm w-fit mb-1">
                  {experience.company}
                </h2>
                <p className="text-xl text-purple-500">
                  {experience.role}
                </p>
                <p className="mb-4 text-orange-500">
                  {experience.type}, {formatDate(experience.from)} - {formatDate(experience.to)} · {getDuration(experience.from, experience.to)}
                </p>
                <div className="text-sm prose prose-sm dark:prose-invert text-gray-400">
                  <ol className="list-decimal pl-5">
                    {experience.description.split('\n').map((point: string, idx: number) => (
                      <li key={idx}>{point.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                  </ol>
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
