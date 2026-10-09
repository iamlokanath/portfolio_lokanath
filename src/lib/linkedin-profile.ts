export type LinkedInPost = {
  id: string;
  url: string;
  text: string;
  time: string;
  image?: string;
  reactions: number;
  comments: number;
};

export type LinkedInProfile = {
  name: string;
  headline: string;
  avatar: string;
  url: string;
  posts: LinkedInPost[];
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
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num: string) => String.fromCharCode(Number(num)))
    .replace(/\u00a0/g, " ");
}

function meta(html: string, key: string) {
  const pattern = new RegExp(
    `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
    "i"
  );
  const match = html.match(pattern);
  return decode(match?.[1] || match?.[2] || "").replace(/\s+/g, " ").trim();
}

function htmlToText(fragment: string) {
  return decode(fragment.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""))
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function postsRegion(html: string) {
  const start = html.search(/class="tab__panel[^"]*\bposts\b/);
  if (start < 0) return "";
  const from = html.indexOf(">", start);
  const end = html.indexOf('class="tab__panel', from + 1);
  return html.slice(from + 1, end > from ? end : html.length);
}

function parsePosts(html: string): LinkedInPost[] {
  const region = postsRegion(html);
  const cards = region.split('class="profile-activity-card');
  const posts: LinkedInPost[] = [];
  const seen = new Set<string>();

  for (const card of cards.slice(1)) {
    const url = decode(card.match(/href="(https:\/\/www\.linkedin\.com\/posts\/[^"]+)"/)?.[1] ?? "");
    const id = url.match(/activity-(\d+)/)?.[1] ?? "";
    const text = htmlToText(card.match(/class="see-more-text[\s\S]*?>([\s\S]*?)<\/div>/)?.[1] ?? "");
    if (!id || !url || !text || seen.has(id)) continue;
    seen.add(id);

    const timeBlock = card.match(/base-main-card__metadata[\s\S]*?<\/div>/)?.[0] ?? "";
    const time =
      timeBlock
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .match(/\b\d+(?:mo|w|d|h|y)\b/)?.[0] ?? "";

    const image = [...card.matchAll(/https:\/\/media\.licdn\.com\/dms\/image\/[^"']+/g)]
      .map((match) => decode(match[0]))
      .find((src) => src.includes("feedshare"));

    posts.push({
      id,
      url,
      text,
      time,
      image,
      reactions: Number(card.match(/data-num-reactions="(\d+)"/)?.[1] ?? 0),
      comments: Number(card.match(/data-num-comments="(\d+)"/)?.[1] ?? 0),
    });
  }

  return posts;
}

export function parseLinkedInProfile(html: string, url: string): LinkedInProfile | null {
  const title = meta(html, "og:title");
  const nameFromTitle = title.split("|")[0]?.split(" - ")[0]?.trim() ?? "";
  const nameFromHeading = decode(
    html.match(/top-card-layout__title[^>]*>\s*([^<]+?)\s*</)?.[1] ?? ""
  ).replace(/\s+/g, " ").trim();
  const name = nameFromHeading || nameFromTitle;
  const avatar = meta(html, "og:image");
  const about = meta(html, "og:description").split(" · ")[0]?.trim() ?? "";
  const company = decode(
    html.match(/top-card-link__description[^>]*>\s*([^<]+?)\s*</)?.[1] ?? ""
  )
    .replace(/\s+/g, " ")
    .trim();
  const headline = [about, company].filter(Boolean).join(" · ");

  if (!name || !avatar) return null;
  return { name, headline, avatar, url, posts: parsePosts(html) };
}

export async function getLinkedInProfile(): Promise<LinkedInProfile | null> {
  const res = await fetch(PROFILE_URL, {
    headers: {
      "User-Agent": "facebookexternalhit/1.1",
      Accept: "text/html",
    },
    next: { revalidate: 600 },
  });
  if (!res.ok) return null;
  return parseLinkedInProfile(await res.text(), PROFILE_URL);
}
