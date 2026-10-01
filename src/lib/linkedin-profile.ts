export type LinkedInProfile = {
  name: string;
  headline: string;
  avatar: string;
  url: string;
};

const PROFILE_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() ||
  "https://www.linkedin.com/in/lokanath-panda-642193238/";

function decode(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function meta(html: string, key: string) {
  const pattern = new RegExp(
    `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
    "i"
  );
  const match = html.match(pattern);
  return decode(match?.[1] || match?.[2] || "");
}

export function parseLinkedInProfile(html: string, url: string): LinkedInProfile | null {
  const title = meta(html, "og:title");
  const nameFromTitle = title.split("|")[0]?.split(" - ")[0]?.trim() ?? "";
  const nameFromHeading = decode(
    html.match(/top-card-layout__title[^>]*>\s*([^<]+?)\s*</)?.[1] ?? ""
  );
  const name = nameFromHeading || nameFromTitle;
  const avatar = meta(html, "og:image");
  const about = meta(html, "og:description").split(" · ")[0]?.trim() ?? "";
  const company = decode(
    html.match(/top-card-link__description[^>]*>\s*([^<]+?)\s*</)?.[1] ?? ""
  );
  const headline = [about, company].filter(Boolean).join(" · ");

  if (!name || !avatar) return null;
  return { name, headline, avatar, url };
}

export async function getLinkedInProfile(): Promise<LinkedInProfile | null> {
  const res = await fetch(PROFILE_URL, {
    headers: {
      "User-Agent": "facebookexternalhit/1.1",
      Accept: "text/html",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return parseLinkedInProfile(await res.text(), PROFILE_URL);
}
