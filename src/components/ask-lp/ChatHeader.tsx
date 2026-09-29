import { cn } from "@/lib/utils";

type ChatHeaderProps = {
  minimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
};

export default function ChatHeader({ minimized, onMinimize, onClose }: ChatHeaderProps) {
  return (
    <div className="relative shrink-0 border-b border-white/[0.08] px-4 py-3.5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="relative mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full" aria-hidden>
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6]" />
            <span className="absolute inset-[1.5px] rounded-full bg-[#070b14]" />
            <span className="relative text-[11px] font-bold bg-gradient-to-r from-[#a78bfa] to-[#38bdf8] bg-clip-text text-transparent">
              LP
            </span>
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 id="ask-lp-title" className="truncate text-sm font-semibold text-white">
                Ask LP
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Online
              </span>
            </div>
            <p className="mt-0.5 text-xs leading-snug text-slate-400">
              AI Career Assistant · Explore my experience through AI.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onMinimize}
            className={cn(
              "rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            )}
            aria-label={minimized ? "Expand Ask LP" : "Minimize Ask LP"}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            )}
            aria-label="Close Ask LP"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
