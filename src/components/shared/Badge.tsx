import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  tone?: "cyan" | "purple" | "muted";
};

const tones = {
  cyan: "border-[var(--color-accent)]/40 text-[var(--color-accent)] bg-[var(--color-accent)]/10",
  purple:
    "border-[var(--color-primary)]/40 text-[var(--color-primary-bright)] bg-[var(--color-primary)]/10",
  muted: "border-[var(--color-border)] text-[var(--color-text-muted)] bg-white/5",
};

export function Badge({ children, className, tone = "cyan" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}
