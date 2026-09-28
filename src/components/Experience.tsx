"use client";

import React from "react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import experienceData from "@/data/experience.json";

function getDuration(from: string, to: string) {
  const start = new Date(from);
  const end = to === "Present" ? new Date() : new Date(to);
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  let result = "";
  if (years > 0) result += `${years} yr${years > 1 ? "s" : ""} `;
  if (months > 0) result += `${months} mo${months > 1 ? "s" : ""}`;
  return result.trim() || "Less than 1 mo";
}

function formatDate(dateStr: string) {
  if (dateStr === "Present") return "Present";
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

type ExperienceProject = {
  name: string;
  stack: string[];
  highlights: string[];
};

type ExperienceItem = {
  id: number;
  role: string;
  company: string;
  location?: string;
  type: string;
  from: string;
  to: string;
  projects: ExperienceProject[];
};

function Experience() {
  const experiences = experienceData.experiences as ExperienceItem[];

  return (
    <div className="px-4 py-12 sm:px-8 md:px-12 bg-gray-900">
      <div className="text-center mb-10">
        <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">
          Experience
        </h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
          Professional Experience
        </p>
      </div>

      <TracingBeam className="px-2 sm:px-6">
        <div className="max-w-4xl mx-auto antialiased relative space-y-12">
          {experiences.map((experience) => (
            <article key={experience.id} className="border-b border-white/10 pb-10 last:border-b-0 last:pb-0">
              <header className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {experience.role},{" "}
                  <span className="text-blue-400">{experience.company}</span>
                  {experience.location ? (
                    <span className="text-zinc-400 font-medium">
                      , {experience.location}
                    </span>
                  ) : null}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {experience.type}
                  </span>
                  <span>
                    {formatDate(experience.from)} – {formatDate(experience.to)}
                  </span>
                  <span className="text-blue-400/80">
                    {getDuration(experience.from, experience.to)}
                  </span>
                </div>
              </header>

              <div className="space-y-8">
                {experience.projects.map((project) => (
                  <div key={project.name}>
                    <h4 className="text-base font-semibold text-white">
                      {project.name}
                      {project.stack.length > 0 ? (
                        <span className="font-normal text-zinc-400">
                          {" "}
                          | <span className="italic">{project.stack.join(", ")}</span>
                        </span>
                      ) : null}
                    </h4>
                    <ul className="mt-3 space-y-2.5">
                      {project.highlights.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm sm:text-[15px] leading-relaxed text-zinc-300"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" aria-hidden />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </TracingBeam>
    </div>
  );
}

export default Experience;
