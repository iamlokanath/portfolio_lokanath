const USER = "iamlokanath";

export type GithubDay = { date: string; count: number };

export type GithubAnalytics = {
  name: string;
  login: string;
  bio: string;
  url: string;
  contributions: number;
  repositories: number;
  pullRequests: number;
  issues: number;
  commits: number;
  reviews: number;
  activeLast7Days: boolean;
  monthly: number[];
  heatmap: GithubDay[];
  languages: { name: string; percent: number; color: string }[];
  recent: {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    url: string;
  }[];
  periodLabel: string;
  rank: { level: string; score: number };
  achievements: { slug: string; name: string; image: string; count: string | null }[];
};

export const GITHUB_PERIODS = ["last", "2026", "2025", "2024", "2023", "2022"] as const;

export function periodRange(period: string) {
  if (period === "last" || !/^\d{4}$/.test(period)) {
    const to = new Date();
    const from = new Date();
    from.setFullYear(from.getFullYear() - 1);
    return {
      key: "last",
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
      calendar: "last",
      label: "last 12 months",
    };
  }
  return {
    key: period,
    from: `${period}-01-01`,
    to: `${period}-12-31`,
    calendar: period,
    label: period,
  };
}

const LANG_COLORS: Record<string, string> = {
  Python: "#38bdf8",
  TypeScript: "#818cf8",
  JavaScript: "#facc15",
  "C++": "#a78bfa",
  Java: "#c084fc",
  HTML: "#fb7185",
  CSS: "#22d3ee",
  C: "#94a3b8",
  Jupyter: "#f97316",
};

type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  fork: boolean;
  size: number;
  pushed_at: string;
  created_at: string;
};

async function github<T>(path: string): Promise<T | null> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-lokanath",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

async function searchCount(query: string): Promise<number> {
  const data = await github<{ total_count: number }>(
    `/search/issues?q=${encodeURIComponent(query)}&per_page=1`
  );
  return data?.total_count ?? 0;
}

async function commitCount(from: string, to: string): Promise<number> {
  const res = await fetch(
    `https://api.github.com/search/commits?q=${encodeURIComponent(
      `author:${USER} committer-date:${from}..${to}`
    )}&per_page=1`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portfolio-lokanath",
      },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) return 0;
  const data = (await res.json()) as { total_count?: number };
  return data.total_count ?? 0;
}

function monthlyCounts(days: GithubDay[]): number[] {
  const buckets = new Map<string, number>();
  for (const day of days) {
    const key = day.date.slice(0, 7);
    buckets.set(key, (buckets.get(key) ?? 0) + day.count);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, count]) => count);
}

function languagesFrom(repos: Repo[]) {
  const totals = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language || repo.fork) continue;
    totals.set(repo.language, (totals.get(repo.language) ?? 0) + Math.max(repo.size, 1));
  }
  const sum = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, size]) => ({
      name,
      percent: Math.round((size / sum) * 1000) / 10,
      color: LANG_COLORS[name] ?? "#64748b",
    }));
}

function calculateRank(input: {
  commits: number;
  prs: number;
  issues: number;
  reviews: number;
  stars: number;
  followers: number;
}) {
  const score =
    1 -
    (2 * (1 - 2 ** -(input.commits / 250)) +
      3 * (1 - 2 ** -(input.prs / 50)) +
      1 * (1 - 2 ** -(input.issues / 25)) +
      1 * (1 - 2 ** -(input.reviews / 2)) +
      4 * (input.stars / 50 / (1 + input.stars / 50)) +
      1 * (input.followers / 10 / (1 + input.followers / 10))) /
      12;
  const levels = ["S", "A+", "A", "A-", "B+", "B", "B-", "C+", "C"];
  const thresholds = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  const level = levels[thresholds.findIndex((threshold) => score * 100 <= threshold)] ?? "C";
  return { level, score: Math.max(0, Math.min(1, 1 - score)) };
}

async function fetchAchievements() {
  const res = await fetch(`https://github.com/${USER}`, {
    headers: { "User-Agent": "portfolio-lokanath", Accept: "text/html" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const html = await res.text();
  const pattern =
    /achievement=([a-z0-9-]+)&amp;tab=achievements[\s\S]*?src="(https:\/\/github\.githubassets\.com\/assets\/[^"]+)"[\s\S]*?alt="Achievement:\s*([^"]+)"([\s\S]*?)<\/a>/g;
  const seen = new Set<string>();
  const items: GithubAnalytics["achievements"] = [];
  for (const match of html.matchAll(pattern)) {
    const slug = match[1];
    if (seen.has(slug)) continue;
    seen.add(slug);
    const tier = match[4].match(/>(x\d+)</);
    items.push({
      slug,
      image: match[2],
      name: match[3],
      count: tier?.[1] ?? null,
    });
  }
  return items;
}

export async function getGithubAnalytics(period = "last"): Promise<GithubAnalytics | null> {
  const range = periodRange(period);
  const [user, page1, page2, calendar, pullRequests, issues, reviews, commits, achievements] =
    await Promise.all([
      github<{
        name: string;
        login: string;
        bio: string | null;
        html_url: string;
        followers: number;
      }>(`/users/${USER}`),
      github<Repo[]>(`/users/${USER}/repos?per_page=100&sort=pushed&page=1`),
      github<Repo[]>(`/users/${USER}/repos?per_page=100&sort=pushed&page=2`),
      fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=${range.calendar}`, {
        next: { revalidate: 3600 },
      }).then(async (res) =>
        res.ok
          ? ((await res.json()) as {
              total?: { lastYear?: number } & Record<string, number>;
              contributions?: GithubDay[];
            })
          : null
      ),
      searchCount(`author:${USER} type:pr created:${range.from}..${range.to}`),
      searchCount(`author:${USER} type:issue created:${range.from}..${range.to}`),
      searchCount(`reviewed-by:${USER} type:pr updated:${range.from}..${range.to}`),
      commitCount(range.from, range.to),
      fetchAchievements(),
    ]);

  if (!user) return null;
  const repos = [...(page1 ?? []), ...(page2 ?? [])];
  const days = calendar?.contributions ?? [];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const activeLast7Days = days.some(
    (day) => day.count > 0 && new Date(day.date) >= weekAgo
  );

  return {
    name: user.name || user.login,
    login: user.login,
    bio: user.bio || "Building scalable web applications and AI solutions.",
    url: user.html_url,
    contributions:
      (range.key === "last" ? calendar?.total?.lastYear : calendar?.total?.[range.key]) ??
      days.reduce((sum, day) => sum + day.count, 0),
    repositories: repos.filter((repo) => !repo.fork).length || repos.length,
    pullRequests,
    issues,
    commits,
    reviews,
    activeLast7Days,
    monthly: monthlyCounts(days),
    heatmap: days,
    languages: languagesFrom(repos),
    recent: repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
      .slice(0, 3)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || "Repository on GitHub",
        language: repo.language || "Code",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
      })),
    periodLabel: range.label,
    rank: calculateRank({
      commits,
      prs: pullRequests,
      issues,
      reviews,
      stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      followers: user.followers ?? 0,
    }),
    achievements,
  };
}
