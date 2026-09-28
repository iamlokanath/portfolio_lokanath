import { cn } from "@/lib/utils";

type ChatHeaderProps = {
  minimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
};

export default function ChatHeader({ minimized, onMinimize, onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3 shrink-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 id="ask-lp-title" className="text-sm font-semibold text-white truncate">
            Ask LP
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Online
          </span>
        </div>
        <p className="mt-0.5 text-xs text-zinc-400 leading-snug">
          AI Career Assistant · Explore my experience through AI.
        </p>
        <p className="mt-1 text-[10px] text-zinc-500">Powered by AI</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onMinimize}
          className={cn(
            "rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
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
            "rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          )}
          aria-label="Close Ask LP"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
