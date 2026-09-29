import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "outline" | "ghost" | "soft";
type Size = "sm" | "md" | "lg";

export type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
};

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

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  function AppButton(
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
