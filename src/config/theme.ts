/**
 * Design tokens — change here to restyle the whole site.
 * Mirrors the portfolio UI mock (dark navy + purple/blue accents).
 */
export const theme = {
  fonts: {
    sans: "var(--font-sans)",
    display: "var(--font-display)",
    mono: "var(--font-mono)",
    script: "var(--font-script)",
  },
  colors: {
    bg: "#030712",
    bgElevated: "#0b1220",
    bgCard: "rgba(15, 23, 42, 0.72)",
    border: "rgba(148, 163, 184, 0.16)",
    borderStrong: "rgba(148, 163, 184, 0.28)",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    textDim: "#64748b",
    primary: "#8b5cf6",
    primaryBright: "#a78bfa",
    secondary: "#3b82f6",
    accent: "#22d3ee",
    success: "#34d399",
    gradientFrom: "#8b5cf6",
    gradientVia: "#6366f1",
    gradientTo: "#3b82f6",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.25rem",
    full: "9999px",
  },
  shadow: {
    glow: "0 0 40px rgba(139, 92, 246, 0.25)",
    card: "0 18px 50px rgba(0, 0, 0, 0.35)",
  },
} as const;

export type Theme = typeof theme;
