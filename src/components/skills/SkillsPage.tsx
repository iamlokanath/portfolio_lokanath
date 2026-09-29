"use client";

import { Container } from "@/components/shared/Container";
import { AppIcon } from "@/components/shared/AppIcon";
import { PageIntro } from "@/components/experience/ExperienceTimeline";
import skills from "@/data/my_skills.json";

const categoryMeta: Record<string, { icon: string; order: number }> = {
  Frontend: { icon: "code", order: 0 },
  Backend: { icon: "server", order: 1 },
  Database: { icon: "database", order: 2 },
  "DevOps & Cloud": { icon: "cloud", order: 3 },
  "Programming Language": { icon: "code", order: 4 },
  Tools: { icon: "wrench", order: 5 },
};

export default function SkillsPage() {
  const grouped = new Map<string, string[]>();
  for (const skill of skills.skills as { title: string; category: string }[]) {
    const list = grouped.get(skill.category) ?? [];
    list.push(skill.title);
    grouped.set(skill.category, list);
  }

  const categories = Array.from(grouped.entries()).sort(
    (a, b) =>
      (categoryMeta[a[0]]?.order ?? 99) - (categoryMeta[b[0]]?.order ?? 99)
  );

  return (
    <main className="min-h-screen bg-site pt-32 pb-16">
      <Container className="max-w-7xl px-4 sm:px-6">
        <PageIntro
          eyebrow="SKILLS & TECHNOLOGIES"
          heading="Tools I use to bring ideas to life."
          description="The languages, frameworks, and tools I use to ship products."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map(([category, items]) => (
            <article
              key={category}
              className="rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 p-5"
            >
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-300">
                  <AppIcon name={categoryMeta[category]?.icon ?? "wrench"} size={15} />
                </span>
                <h2 className="text-sm font-semibold text-white">{category}</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item: string) => (
                  <span
                    key={item}
                    className="rounded-md bg-white/[0.06] px-2.5 py-1 text-[12px] text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </main>
  );
}
