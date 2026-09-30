"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, GitCommit, GitFork, GitPullRequest, Star } from "lucide-react";
import { AppIcon } from "@/components/shared/AppIcon";
import { Container } from "@/components/shared/Container";
import { type GithubAnalytics, type GithubDay } from "@/lib/github-analytics";

const PERIODS = ["last", "2026", "2025", "2024", "2023", "2022"];

const WEEKDAYS = ["Mon", "", "Wed", "", "Fri", "", ""];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function sparkPoints(values: number[]) {
  if (values.length < 2) return "";
  const max = Math.max(...values, 1);
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 28 - (value / max) * 24;
      return `${x},${y}`;
    })
    .join(" ");
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const points = sparkPoints(values);
  if (!points) return null;
  return (
    <svg viewBox="0 0 100 32" className="mt-3 h-8 w-full" aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth="1.6" points={points} />
    </svg>
  );
}

function levelClass(count: number) {
  if (count <= 0) return "bg-white/[0.06]";
  if (count < 6) return "bg-blue-900";
  if (count < 16) return "bg-blue-600";
  if (count < 31) return "bg-indigo-500";
  return "bg-violet-400";
}

function YearSelect({
  period,
  loading,
  onChange,
}: {
  period: string;
  loading: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const label = period === "last" ? "Last 12 months" : period;

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={loading}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filter GitHub activity by year"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 bg-[#0b1220] px-4 text-[13px] text-slate-100 outline-none transition-colors hover:border-white/25 focus-visible:border-sky-400/50 disabled:opacity-60"
      >
        {label}
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label="Filter GitHub activity by year"
          className="absolute left-0 z-30 mt-2 min-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c1424] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
        >
          {PERIODS.map((item) => {
            const selected = item === period;
            const text = item === "last" ? "Last 12 months" : item;
            return (
              <li key={item}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center whitespace-nowrap rounded-xl px-3 py-2 text-left text-[13px] transition-colors ${
                    selected ? "bg-sky-400/15 text-sky-100" : "text-slate-200 hover:bg-white/[0.06]"
                  }`}
                >
                  {text}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function heatmapWeeks(days: GithubDay[]) {
  if (!days.length) return [];
  const firstDow = (new Date(`${days[0].date}T00:00:00`).getDay() + 6) % 7;
  const padded: Array<GithubDay | null> = [...Array(firstDow).fill(null), ...days];
  const weeks: Array<Array<GithubDay | null>> = [];
  for (let index = 0; index < padded.length; index += 7) {
    weeks.push(padded.slice(index, index + 7));
  }
  return weeks;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className ?? ""}`} />;
}

function GitHubSkeleton({
  period,
  loading,
  onChange,
}: {
  period: string;
  loading: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <section id="github" className="section-pad min-w-0 overflow-x-hidden" aria-busy="true">
      <Container className="max-w-7xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">GitHub Analytics</h2>
        <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-6 w-56" />
          <div className="flex flex-wrap items-center gap-2">
            <YearSelect period={period} loading={loading} onChange={onChange} />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 p-4 sm:p-5">
          <div className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-5">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-3">
          <Skeleton className="h-52 xl:col-span-1" />
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      </Container>
    </section>
  );
}

export default function GitHubAnalyticsSection() {
  const [period, setPeriod] = useState("last");
  const [data, setData] = useState<GithubAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    fetch(`/api/github-analytics?period=${period}`)
      .then(async (res) => {
        const json = (await res.json()) as GithubAnalytics & { error?: string };
        if (!cancel && res.ok && !json.error) setData(json);
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [period]);

  if (!data || loading) {
    return <GitHubSkeleton period={period} loading={loading} onChange={setPeriod} />;
  }

  const weeks = heatmapWeeks(data.heatmap);
  const monthMarks = new Map<number, string>();
  let lastMonth = -1;
  weeks.forEach((week, index) => {
    const day = week.find((item) => item);
    if (!day) return;
    const month = Number(day.date.slice(5, 7)) - 1;
    if (month !== lastMonth) {
      monthMarks.set(index, MONTHS[month]);
      lastMonth = month;
    }
  });

  const metrics = [
    { label: `Contributions · ${data.periodLabel}`, value: data.contributions, color: "#34d399" },
    { label: "Repositories", value: data.repositories, color: "#38bdf8" },
    { label: "Pull requests", value: data.pullRequests, color: "#a78bfa" },
    { label: "Issues", value: data.issues, color: "#fbbf24" },
  ];

  return (
    <section id="github" className="section-pad min-w-0 overflow-x-hidden">
      <Container className="max-w-7xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">GitHub Analytics</h2>
        <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-white">Open source activity</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live from GitHub
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <YearSelect period={period} loading={loading} onChange={setPeriod} />
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-[13px] text-white transition-colors hover:bg-white/[0.04]"
            >
              View GitHub →
            </a>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 p-4 sm:p-5">
          <div className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-[1.15fr_repeat(4,minmax(0,1fr))]">
            <div className="flex gap-3">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white">
                <AppIcon name="github" size={22} />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-white">{data.name}</p>
                <p className="text-xs text-slate-400">@{data.login}</p>
                <p className="mt-2 break-words text-xs leading-relaxed text-slate-400">{data.bio}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {data.activeLast7Days ? "Active in the last 7 days" : "No pushes in the last 7 days"}
                </p>
              </div>
            </div>
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-0 sm:border-white/[0.06] xl:border-l xl:pl-4">
                <p className="text-[11px] text-slate-400">{metric.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{formatCount(metric.value)}</p>
                <Sparkline values={data.monthly} color={metric.color} />
                <p className="mt-1 text-[10px] text-slate-500">Live from GitHub</p>
              </div>
            ))}
          </div>
        </div>

        <article className="mt-4 flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 p-4 sm:flex-row sm:items-center sm:gap-0 sm:p-5">
          <div className="flex shrink-0 flex-col items-center sm:w-[180px] sm:border-r sm:border-white/[0.08] sm:pr-5">
            <p className="mb-3 text-sm font-semibold text-white">GitHub rank</p>
            <svg viewBox="0 0 120 120" className="h-24 w-24" aria-label={`Rank ${data.rank.level}`}>
              <circle cx="60" cy="60" r="46" fill="none" stroke="#1e293b" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${Math.max(18, data.rank.score * 289)} 289`}
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="68" textAnchor="middle" fill="#6ee7b7" fontSize="28" fontWeight="700">
                {data.rank.level}
              </text>
            </svg>
          </div>
          <div className="min-w-0 flex-1 sm:pl-6">
            <p className="text-sm font-semibold text-white">Achievements</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {data.achievements.length === 0 ? (
                <p className="text-xs text-slate-400">No public achievements yet.</p>
              ) : (
                data.achievements.map((badge) => (
                  <a
                    key={badge.slug}
                    href={`${data.url}?achievement=${badge.slug}&tab=achievements`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={badge.name}
                    className="relative inline-flex h-16 w-16"
                  >
                    <img src={badge.image} alt={badge.name} className="h-16 w-16 rounded-full object-cover" />
                    {badge.count ? (
                      <span className="absolute -bottom-1 -right-1 rounded-full bg-[#0b1220] px-1.5 text-[10px] font-semibold text-white">
                        {badge.count}
                      </span>
                    ) : null}
                  </a>
                ))
              )}
            </div>
          </div>
        </article>

        <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)]">
          <article className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-white">Contribution activity</p>
              <span className="text-[11px] text-emerald-300">Updated from GitHub</span>
            </div>
            <div className="thin-scroll max-w-full overflow-x-auto pb-2">
              <div className="w-max">
              <div className="mb-2 grid grid-flow-col gap-[3px] pl-8 text-[10px] text-slate-500" style={{ gridAutoColumns: "11px" }}>
                {weeks.map((week, index) => (
                  <span key={week.find((day) => day)?.date ?? index}>{monthMarks.get(index) ?? ""}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col justify-between py-0.5 text-[10px] text-slate-500">
                  {WEEKDAYS.map((day, index) => (
                    <span key={`${day}-${index}`} className="h-[10px] leading-[10px]">{day}</span>
                  ))}
                </div>
                <div className="grid grid-flow-col gap-[3px]" style={{ gridAutoColumns: "11px" }}>
                  {weeks.map((week, weekIndex) => (
                    <div key={week.find((day) => day)?.date ?? weekIndex} className="grid grid-rows-7 gap-[3px]">
                      {week.map((day, dayIndex) =>
                        day ? (
                          <span
                            key={day.date}
                            title={`${day.date}: ${day.count} contributions`}
                            className={`h-[10px] w-[10px] rounded-[2px] ${levelClass(day.count)}`}
                          />
                        ) : (
                          <span key={`empty-${weekIndex}-${dayIndex}`} className="h-[10px] w-[10px]" />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                Less
                {[0, 2, 10, 20, 40].map((count) => (
                  <span key={count} className={`h-[10px] w-[10px] rounded-[2px] ${levelClass(count)}`} />
                ))}
                More
              </div>
              </div>
            </div>
          </article>

          <article className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 p-4">
            <p className="text-sm font-semibold text-white">Top languages</p>
            <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
              {data.languages.map((lang) => (
                <span key={lang.name} style={{ width: `${lang.percent}%`, background: lang.color }} />
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {data.languages.map((lang) => (
                <li key={lang.name} className="flex items-center justify-between text-xs text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: lang.color }} />
                    {lang.name}
                  </span>
                  <span>{lang.percent}%</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 p-4">
            <p className="text-sm font-semibold text-white">Coding activity</p>
            <ul className="mt-4 space-y-3 text-xs text-slate-300">
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><GitCommit size={14} color="#818cf8" /> Commits</span><span className="text-sm font-semibold text-white">{formatCount(data.commits)}</span></li>
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><GitPullRequest size={14} color="#c084fc" /> Pull requests</span><span className="text-sm font-semibold text-white">{formatCount(data.pullRequests)}</span></li>
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><GitPullRequest size={14} color="#34d399" /> Reviews</span><span className="text-sm font-semibold text-white">{formatCount(data.reviews)}</span></li>
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><AppIcon name="github" size={14} /> Repositories</span><span className="text-sm font-semibold text-white">{formatCount(data.repositories)}</span></li>
            </ul>
          </article>
        </div>

        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Recent repositories</p>
            <a href={`${data.url}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400">
              View all repositories →
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {data.recent.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 p-4 hover:border-violet-400/30"
              >
                <p className="font-medium text-white">{repo.name}</p>
                <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-400">{repo.description}</p>
                <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-sky-300">{repo.language}</span>
                  <span className="inline-flex items-center gap-1"><Star size={12} /> {repo.stars}</span>
                  <span className="inline-flex items-center gap-1"><GitFork size={12} /> {repo.forks}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
