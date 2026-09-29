/**
 * Ask LP profile knowledge — composed from portfolio JSON + extras only.
 *
 * Source of truth:
 * - projects  → src/data/projects.json
 * - experience → src/data/experience.json
 * - skills (UI icons) → src/data/my_skills.json
 *
 * Keep ONLY things not represented there in `profileExtras` below
 * (identity, summary, education, strengths, AI skill notes, guardrails).
 */
  
import projectsData from "@/data/projects.json";
import experienceData from "@/data/experience.json";
import skillsData from "@/data/my_skills.json";

/** Data that does not live in projects.json / experience.json / my_skills.json */
export const profileExtras = {  
  identity: {
    name: "Lokanath Panda",
    title: "Software Development Engineer",
    email: "lokanathpanda128@gmail.com",
    phone: "8144496407",
    location: "Bhubaneswar, Odisha",
    resumeUrl: "/Image/Lokanath_Panda_8144496407.pdf",
    linkedin: "https://www.linkedin.com/in/lokanath-panda-642193238/",
    github: "https://github.com/iamlokanath",
    whatsapp: "https://api.whatsapp.com/send/?phone=9090272275",
  },

  summary:
    "Software Engineer with 1.5 years of experience building scalable web applications, proficient in React.js, Next.js, Python FastAPI, and AWS. Delivered 10+ production platforms featuring REST APIs, LLM integrations, role-based access control, and CI/CD pipelines — spanning government portals, AI-powered hiring platforms, and internal business tools.",

  education: [
    {
      degree: "B.Tech, Computer Science Engineering",
      institution: "Government College of Engineering Kalahandi, Odisha",
      duration: "2021 - 2025",
      cgpa: "8.28/10",
    },
  ],

  /** Skills mentioned on the resume / for Ask LP that are not (yet) in my_skills.json icons */
  skillExtras: {
    backend: ["Python FastAPI", "Django REST Framework"],
    database: ["PostgreSQL", "MySQL"],
    devopsCloud: ["AWS EC2", "AWS Lambda", "AWS Cognito", "CI/CD", "Git"],
    ai: [
      "Large Language Models (LLM)",
      "OCR/NLP document extraction (IDP)",
      "Cohere LLM integration (AI question generation)",
      "NLP-based resume parsing",
      "AI-driven skill matching (Career Align)",
    ],
  },

  strengths: [
    "Full lifecycle ownership — frontend, backend, database, and cloud deployment",
    "Experience shipping 10+ production platforms, including a government-facing portal and multi-tenant SaaS-style hiring platforms",
    "Applied AI/LLM experience: Cohere-based question generation, NLP resume parsing, and AI-driven skill matching",
    "Comfortable with role-based, multi-tenant system design (student/university/corporate/admin architectures)",
  ],

  notVerified:
    "Do not claim experience with Kubernetes or any technology not explicitly listed in skills/projects/experience. FastAPI, PostgreSQL, AWS EC2, AWS Lambda, AWS Cognito, and CI/CD are verified — do not re-flag these as unverified.",
} as const;

type JsonProject = (typeof projectsData.projects)[number] & {
  stack?: string[];
  image?: string;
};

function formatMonthYear(dateStr: string): string {
  if (dateStr === "Present") return "Present";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function mapExperience() {
  return experienceData.experiences.map((e) => {
    const projects =
      "projects" in e && Array.isArray(e.projects)
        ? e.projects.map((p: { name: string; stack?: string[]; highlights: string[] }) => ({
            name: p.name,
            stack: p.stack ?? [],
            highlights: p.highlights,
          }))
        : [];

    const highlights = projects.flatMap((p) =>
      p.highlights.map((h) => `[${p.name}] ${h}`)
    );

    return {
      role: e.role,
      company: e.company,
      type: e.type,
      location: "location" in e ? String((e as { location?: string }).location ?? "") : "",
      duration: `${formatMonthYear(e.from)} - ${formatMonthYear(e.to)}`,
      projects,
      highlights,
    };
  });
}

function mapProjects() {
  return (projectsData.projects as JsonProject[]).map((p) => ({
    name: p.title,
    description: p.description,
    link: p.link?.startsWith("http") || !p.link ? p.link || "" : `https://${p.link}`,
    stack: p.stack ?? [],
    image: p.image || "",
  }));
}

const SKILL_TITLE_MAP: Record<string, string> = {
  JS: "JavaScript",
  TS: "TypeScript",
  NextJs: "Next.js",
  TailwindCSS: "Tailwind CSS",
  node: "Node.js",
  express: "Express",
  Github: "GitHub",
};

const CATEGORY_KEY: Record<string, string> = {
  Frontend: "frontend",
  Backend: "backend",
  Database: "database",
  "DevOps & Cloud": "devopsCloud",
  "Programming Language": "programmingLanguages",
  Tools: "tools",
};

function mapSkills() {
  const skills: Record<string, string[]> = {
    frontend: [],
    backend: [],
    database: [],
    devopsCloud: [],
    programmingLanguages: [],
    ai: [],
    tools: [],
  };

  for (const s of skillsData.skills) {
    const key = CATEGORY_KEY[s.category] ?? "tools";
    const label = SKILL_TITLE_MAP[s.title] ?? s.title;
    if (!skills[key]) skills[key] = [];
    if (!skills[key].includes(label)) skills[key].push(label);
  }

  for (const [key, extras] of Object.entries(profileExtras.skillExtras)) {
    if (!skills[key]) skills[key] = [];
    for (const item of extras) {
      if (!skills[key].includes(item)) skills[key].push(item);
    }
  }

  return skills;
}

export const profileKnowledge = {
  identity: profileExtras.identity,
  summary: profileExtras.summary,
  education: profileExtras.education,
  experience: mapExperience(),
  projects: mapProjects(),
  skills: mapSkills(),
  strengths: profileExtras.strengths,
  notVerified: profileExtras.notVerified,
};

export type ProfileKnowledge = typeof profileKnowledge;
export type ProfileProject = (typeof profileKnowledge.projects)[number];

/** Thumbnails from projects.json for Ask LP evidence cards (UI only). */
export const projectThumbnails: Record<string, string> = Object.fromEntries(
  profileKnowledge.projects
    .filter((p) => Boolean(p.image))
    .map((p) => [p.name, p.image])
);
