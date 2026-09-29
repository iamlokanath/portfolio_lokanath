import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "div" | "section" | "footer" | "header";
};

export function Container({
  children,
  className,
  id,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag id={id} className={cn("mx-auto w-full min-w-0 max-w-6xl", className)}>
      {children}
    </Tag>
  );
}
