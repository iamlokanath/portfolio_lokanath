import { cn } from "@/lib/utils";

type GlowArcProps = {
  className?: string;
};

/** Small corner arc — only a short glowing curve should show. */
export function GlowArc({ className }: GlowArcProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-28 w-28 rounded-full sm:h-36 sm:w-36",
        "border border-violet-300/70",
        "shadow-[0_0_16px_rgba(167,139,250,0.7)]",
        className
      )}
    />
  );
}
