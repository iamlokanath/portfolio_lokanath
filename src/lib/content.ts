import type { SocialLink } from "@/types/portfolio";
import { envOr, publicEmailHref } from "@/lib/env-public";

export function resolveSocialHref(item: SocialLink): string {
  const raw = envOr(item.hrefEnvKey, item.fallback);
  if (item.isEmail) {
    return publicEmailHref(raw.replace(/^mailto:/, ""));
  }
  return raw;
}

export function formatMonthYear(dateStr: string): string {
  if (dateStr === "Present") return "Present";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}
