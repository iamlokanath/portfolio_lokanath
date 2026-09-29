"use client";

import { ArrowUp } from "lucide-react";
import { Container } from "@/components/shared/Container";
import site from "@/data/content/site.json";
import footer from "@/data/content/footer.json";

function scrollToTop() {
  const distance = window.scrollY;
  if (distance < 8) return;

  const duration = Math.min(4.2, Math.max(2.2, distance / 900));
  const easing = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;

  if (window.__lenis) {
    window.__lenis.scrollTo(0, { duration, easing, force: true });
    return;
  }

  const start = window.scrollY;
  const started = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - started) / (duration * 1000));
    window.scrollTo(0, start * (1 - easing(progress)));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <Container className="px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gradient-brand">{site.brand.short}</span>
          <span className="text-sm text-[var(--color-text-muted)]">
            {site.brand.name}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-dim)] text-center">
          {footer.copyrightPrefix} {year} {site.brand.name}. {footer.tagline}
        </p>
        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
          aria-label={footer.backToTopLabel}
        >
          <ArrowUp size={16} />
        </button>
      </Container>
    </footer>
  );
}
