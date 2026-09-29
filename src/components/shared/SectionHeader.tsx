import { cn } from "@/lib/utils";
import Link from "next/link";

type SectionHeaderProps = {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
  action?: { label: string; href: string };
  className?: string;
};

export function SectionHeader({
  eyebrow,
  heading,
  description,
  align = "left",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "text-center md:flex-col md:items-center",
        className
      )}
    >
      <div className={cn(align === "center" && "mx-auto max-w-2xl")}>
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--color-accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
          {heading}
        </h2>
        {description ? (
          <p className="mt-3 text-[var(--color-text-muted)] text-sm sm:text-base max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="text-sm text-[var(--color-primary-bright)] hover:text-white transition-colors whitespace-nowrap"
        >
          {action.label} →
        </Link>
      ) : null}
    </div>
  );
}
