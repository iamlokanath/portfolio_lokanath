"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import site from "@/data/content/site.json";

type BrandLogoProps = {
  className?: string;
  showName?: boolean;
};

export function BrandLogo({ className, showName = true }: BrandLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <span
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full"
        aria-hidden
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8b5cf6] via-[#6366f1] to-[#3b82f6]" />
        <span className="absolute inset-[1.5px] rounded-full bg-[#070b14]" />
        <span className="relative text-[11px] font-bold tracking-tight bg-gradient-to-r from-[#a78bfa] to-[#38bdf8] bg-clip-text text-transparent">
          {site.brand.short}
        </span>
      </span>
      {showName ? (
        <span className="hidden sm:inline text-[15px] font-medium text-white tracking-tight">
          {site.brand.name}
        </span>
      ) : null}
    </Link>
  );
}
