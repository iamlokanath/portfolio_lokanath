import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "soft";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white shadow-[var(--shadow-glow)] border border-white/10 hover:opacity-95",
  outline:
    "bg-transparent text-[var(--color-text)] border border-[var(--color-border-strong)] hover:bg-white/5",
  ghost: "bg-transparent text-[var(--color-text-muted)] hover:text-white hover:bg-white/5",
  soft: "bg-white/5 text-white border border-[var(--color-border)] hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-xs rounded-full",
  md: "h-11 px-5 text-sm rounded-full",
  lg: "h-12 px-6 text-sm rounded-full",
};

type AppLinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  download?: boolean;
};

export function AppLinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  download,
}: AppLinkButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
    variants[variant],
    sizes[size],
    className
  );

  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        download={download || undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} download={download || undefined}>
      {children}
    </Link>
  );
}
