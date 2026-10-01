"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import nav from "@/data/content/nav.json";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { resumeHref } from "@/lib/env-public";

function sectionId(href: string) {
  return href.includes("#") ? href.split("#")[1] : "";
}

export default function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const lastY = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > lastY.current && y > 80 && !open);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (!onHome) return;
    const onScroll = () => {
      const ids = nav.links.map((link) => sectionId(link.href)).filter(Boolean);
      let current = ids[0] ?? "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) current = id;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return onHome && activeSection === sectionId(href);
    return pathname === href;
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-transform duration-300",
        hidden ? "-translate-y-full" : "translate-y-0",
        scrolled ? "py-3" : "py-4"
      )}
    >
      <div className="mx-auto w-full max-w-7xl min-w-0 px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between gap-2 rounded-full px-3 sm:px-5 py-2",
            "border border-white/[0.08] bg-[#0b1220]/75 backdrop-blur-2xl",
            "shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          )}
        >
          <BrandLogo />

          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
            {nav.links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={cn(
                    "relative px-2.5 xl:px-3 py-2 text-[13px] transition-colors",
                    active ? "text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  {link.label}
                  {active ? (
                    <span className="absolute left-2.5 right-2.5 xl:left-3 xl:right-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={resumeHref()}
              download
              aria-label={nav.resumeCta.ariaLabel}
              className={cn(
                "hidden sm:inline-flex items-center gap-2 rounded-full px-4 h-9 text-[13px] font-medium text-white",
                "bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]",
                "shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:opacity-95 transition-opacity"
              )}
            >
              <Download size={14} strokeWidth={2.25} />
              {nav.resumeCta.label}
            </a>

            <button
              type="button"
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white"
              aria-expanded={open}
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-4 bg-current" />
                <span className="block h-0.5 w-4 bg-current" />
                <span className="block h-0.5 w-3 bg-current" />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              key="mobile-menu"
              initial={reduceMotion ? false : { opacity: 0.35, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0.35, rotateX: -90 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.9, ease: [0.45, 0.05, 0.2, 1] }
              }
              style={{ transformPerspective: 900, transformOrigin: "top center" }}
              className="mt-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1220]/95 p-3 backdrop-blur-xl lg:hidden"
            >
              {nav.links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={resumeHref()}
                download
                className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] text-sm font-medium text-white"
              >
                <Download size={14} />
                {nav.resumeCta.label}
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
