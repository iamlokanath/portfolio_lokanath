"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      smoothWheel: true,
      anchors: true,
      allowNestedScroll: true,
    });
    window.__lenis = lenis;

    return () => {
      delete window.__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
