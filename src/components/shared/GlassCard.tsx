import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
};

export function GlassCard({ children, className, as: Tag = "div" }: GlassCardProps) {
  return (
    <Tag className={cn("glass-card rounded-[var(--radius-xl)] p-5 md:p-6", className)}>
      {children}
    </Tag>
  );
}
