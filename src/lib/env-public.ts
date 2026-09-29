/**
 * Resolve public config from env with JSON fallbacks (never put secrets here).
 */
export function envOr(key: string, fallback: string): string {
  if (typeof process === "undefined") return fallback;
  const value = process.env[key];
  return value && value.trim() ? value.trim() : fallback;
}

export function publicEmailHref(email: string): string {
  return email.startsWith("mailto:") ? email : `mailto:${email}`;
}

export function resumeHref(): string {
  return envOr(
    "NEXT_PUBLIC_RESUME_PATH",
    "/Image/Lokanath_Panda_8144496407.pdf"
  );
}
