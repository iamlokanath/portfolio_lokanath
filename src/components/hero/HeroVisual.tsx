"use client";

import type { HeroContent } from "@/types/portfolio";
import { cn } from "@/lib/utils";

type HeroVisualProps = {
  data: HeroContent["codeWindow"];
};

const tokenClass: Record<string, string> = {
  keyword: "text-[#c4b5fd]",
  key: "text-sky-200",
  string: "text-[#22d3ee]",
  plain: "text-slate-300",
  indent: "text-transparent select-none",
};

export function HeroVisual({ data }: HeroVisualProps) {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[440px] overflow-hidden lg:max-w-[480px]">
      <div className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.28),transparent_62%)] blur-2xl sm:-inset-10" />

      <div
        className="pointer-events-none absolute left-1/2 top-[48%] z-0 hidden h-[78%] w-full -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] sm:block sm:w-[108%]"
        aria-hidden
      >
        <div className="absolute inset-0 rounded-[50%] border border-sky-400/30" />
        <span className="absolute right-[6%] top-[30%] h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_16px_rgba(167,139,250,1)]" />
        <span className="absolute left-[8%] bottom-[22%] h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,1)]" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[52%] z-0 hidden h-[96%] w-full -translate-x-1/2 -translate-y-1/2 rotate-[12deg] sm:block sm:w-[128%]"
        aria-hidden
      >
        <div className="absolute inset-0 rounded-[50%] border border-violet-400/20" />
        <span className="absolute right-[20%] top-[6%] h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.9)]" />
      </div>

      <p className="relative z-20 mb-3 max-w-full text-right font-script text-xl leading-none text-[#c4b5fd] sm:text-[1.35rem]">
        {data.annotation}
      </p>

      <div className="relative z-10 max-w-full overflow-hidden rounded-2xl border border-white/[0.1] bg-[#070b14]/95 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="relative flex items-center gap-2 border-b border-white/[0.08] px-3 py-3 sm:px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
          <span className="pointer-events-none absolute inset-x-0 text-center text-[11px] text-slate-500 font-mono">
            {data.filename}
          </span>
        </div>
        <pre className="max-w-full overflow-x-auto p-3 text-[11px] leading-[1.7] font-mono sm:p-6 sm:text-[13.5px] sm:leading-[1.85]">
          <code>
            {data.lines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap break-words sm:whitespace-pre">
                {line.map((part, j) => (
                  <span
                    key={`${i}-${j}`}
                    className={cn(tokenClass[part.type] ?? "text-slate-300")}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
