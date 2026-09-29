"use client";

import Image from "next/image";
import { profileKnowledge, projectThumbnails, type ProfileProject } from "@/data/profile-knowledge";
import { cn } from "@/lib/utils";

type ProjectEvidenceCardProps = {
  projectName: string;
};

export function findMentionedProjects(text: string) {
  const found: ProfileProject[] = [];
  const lower = text.toLowerCase();
  for (const project of profileKnowledge.projects) {
    if (lower.includes(project.name.toLowerCase())) {
      found.push(project);
    }
  }
  const aliases: Record<string, string> = {
    "grievance portal": "Grievance Portal, Government of Odisha",
    aariah: "NGO Portfolio Website",
    "resume builder": "AI Resume Builder",
    "crypto tracker": "Real-Time Crypto Price Tracker",
    "naval ncc": "Gcek Naval Ncc",
    "image management": "Role Based Image Management System",
    "aws automation": "AWS Automation with Terraform & Python",
    solviq: "SOLVIQAI - AI Placement Simulator",
    disha: "DISHA - Job Portal",
    "code generator": "Code Generator - Café Management System",
  };
  for (const [alias, name] of Object.entries(aliases)) {
    if (lower.includes(alias)) {
      const p = profileKnowledge.projects.find((x) => x.name === name);
      if (p && !found.some((f) => f.name === p.name)) found.push(p);
    }
  }
  return found.slice(0, 3);
}

export default function ProjectEvidenceCard({ projectName }: ProjectEvidenceCardProps) {
  const project = profileKnowledge.projects.find((p) => p.name === projectName);
  if (!project) return null;
  const thumb = projectThumbnails[project.name];
  const hasLink = Boolean(project.link);

  const inner = (
    <>
      {thumb ? (
        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#0b1220]">
          <Image src={thumb} alt="" fill className="object-cover" sizes="80px" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <p className="text-xs font-medium text-white truncate">{project.name}</p>
        {project.stack.length > 0 ? (
          <p className="text-[10px] text-slate-500 truncate">{project.stack.join(" · ")}</p>
        ) : null}
        {hasLink ? (
          <span className="mt-1 text-[11px] text-sky-300">View Project →</span>
        ) : null}
      </div>
    </>
  );

  const className = cn(
    "mt-2 flex gap-3 rounded-2xl border border-white/[0.08] bg-[#0b1220] p-2.5",
    hasLink && "hover:border-violet-400/40 transition-colors",
    hasLink && "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
  );

  if (hasLink) {
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}
