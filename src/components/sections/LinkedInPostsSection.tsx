"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, Globe, Heart, PartyPopper, ThumbsUp } from "lucide-react";
import { AppIcon } from "@/components/shared/AppIcon";
import { Container } from "@/components/shared/Container";

const VISIBLE = 3;
const PROFILE_FALLBACK = "https://www.linkedin.com/in/lokanath-panda-642193238/";

type LinkedInPost = {
  id: string;
  url: string;
  text: string;
  time: string;
  image?: string;
  reactions: number;
  comments: number;
};

type LinkedInAuthor = {
  name: string;
  headline: string;
  avatar: string;
  url: string;
};

function commentLabel(count: number) {
  return `${count} comment${count === 1 ? "" : "s"}`;
}

const clamp = (lines: number): CSSProperties => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: lines,
  overflow: "hidden",
});

function PostCard({ post, author }: { post: LinkedInPost; author: LinkedInAuthor | null }) {
  const preview = post.text.replace(/\s+/g, " ").trim();

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-[26rem] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1628] transition-colors hover:border-sky-400/30"
    >
      <div className="flex shrink-0 items-start gap-3 px-4 pt-4">
        {author ? (
          <img src={author.avatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-white/10" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {author ? (
              <p className="truncate text-sm font-semibold text-white">{author.name}</p>
            ) : (
              <span className="h-3.5 w-28 animate-pulse rounded bg-white/10" />
            )}
            <BadgeCheck size={15} className="shrink-0 text-sky-400" aria-hidden />
          </div>
          {author ? (
            <p className="truncate text-xs text-slate-400">{author.headline}</p>
          ) : (
            <span className="mt-1.5 block h-3 w-40 animate-pulse rounded bg-white/10" />
          )}
          {post.time ? (
            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500">
              <span>{post.time}</span>
              <span aria-hidden>·</span>
              <Globe size={11} />
            </p>
          ) : null}
        </div>
      </div>

      {post.image ? (
        <>
          <p className="mt-3 h-[4.5rem] shrink-0 overflow-hidden px-4 text-sm leading-6 text-slate-100" style={clamp(3)}>
            {preview}
            <span className="text-slate-400"> ... more</span>
          </p>
          <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
            <img src={post.image} alt="" className="absolute inset-0 h-full w-full object-contain" />
          </div>
        </>
      ) : (
        <div className="mt-3 min-h-0 flex-1 overflow-hidden px-4">
          <p className="whitespace-pre-line text-sm leading-6 text-slate-100" style={clamp(10)}>
            {post.text}
            <span className="text-slate-400"> ... more</span>
          </p>
        </div>
      )}

      <div className="mt-auto flex h-12 shrink-0 items-center justify-between gap-3 border-t border-white/[0.06] px-4 text-[12px] text-slate-400">
        {post.reactions > 0 ? (
          <span className="inline-flex min-w-0 items-center gap-2">
            <span className="inline-flex shrink-0 -space-x-1">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-white">
                <ThumbsUp size={9} />
              </span>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                <PartyPopper size={9} />
              </span>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white">
                <Heart size={9} />
              </span>
            </span>
            <span className="truncate">{new Intl.NumberFormat("en-US").format(post.reactions)}</span>
          </span>
        ) : (
          <span />
        )}
        {post.comments > 0 ? <span className="shrink-0">{commentLabel(post.comments)}</span> : null}
      </div>
    </a>
  );
}

export default function LinkedInPostsSection() {
  const [start, setStart] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [moved, setMoved] = useState(false);
  const [author, setAuthor] = useState<LinkedInAuthor | null>(null);
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancel = false;
    fetch("/api/linkedin-profile")
      .then(async (res) => {
        const json = (await res.json()) as LinkedInAuthor & {
          error?: string;
          posts?: LinkedInPost[];
        };
        if (cancel || !res.ok) {
          if (!cancel) setStatus("error");
          return;
        }
        if (json.name && json.avatar) {
          setAuthor({ name: json.name, headline: json.headline, avatar: json.avatar, url: json.url });
        }
        setPosts(Array.isArray(json.posts) ? json.posts : []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancel) setStatus("error");
      });
    return () => {
      cancel = true;
    };
  }, []);

  const profileHref =
    author?.url || process.env.NEXT_PUBLIC_LINKEDIN_URL || PROFILE_FALLBACK;
  const visible = Array.from({ length: Math.min(VISIBLE, posts.length) }, (_, offset) => {
    return posts[(start + offset) % posts.length];
  });

  const move = (step: 1 | -1) => {
    if (posts.length < 2) return;
    setDirection(step);
    setMoved(true);
    setStart((current) => (current + step + posts.length) % posts.length);
  };

  return (
    <section id="linkedin" className="section-pad min-w-0 overflow-x-hidden">
      <Container className="max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">LinkedIn</h2>
          <div className="flex shrink-0 items-center gap-2">
            {posts.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Show previous posts"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#0b1220]/75 text-white transition-colors hover:border-sky-400/40 hover:text-sky-200"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Show next posts"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#0b1220]/75 text-white transition-colors hover:border-sky-400/40 hover:text-sky-200"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            ) : null}
            <a
              href={profileHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View profile"
              className="ml-1 inline-flex h-9 items-center gap-2 rounded-full border border-white/15 px-4 text-[13px] text-white transition-colors hover:bg-white/[0.04]"
            >
              <AppIcon name="linkedin" size={14} className="text-sky-300" />
              <span className="hidden sm:inline">View profile</span>
            </a>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">Recent posts from my profile.</p>

        {status === "loading" ? (
          <div className="mt-8 grid min-w-0 grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
            {Array.from({ length: VISIBLE }, (_, index) => (
              <div
                key={index}
                className={`h-[26rem] animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.04] ${
                  index === 0 ? "" : "hidden lg:block"
                }`}
              />
            ))}
          </div>
        ) : null}

        {status === "error" ? (
          <p className="mt-8 text-sm text-slate-400">LinkedIn posts could not be loaded right now.</p>
        ) : null}

        {status === "ready" && posts.length === 0 ? (
          <p className="mt-8 text-sm text-slate-400">No public posts on this profile yet.</p>
        ) : null}

        {status === "ready" && posts.length > 0 ? (
          <div
            key={`${start}-${direction}`}
            className={`mt-8 grid min-w-0 grid-cols-1 items-stretch gap-4 lg:grid-cols-3 ${
              moved ? (direction > 0 ? "linkedin-slide-next" : "linkedin-slide-prev") : ""
            }`}
          >
            {visible.map((post, index) => (
              <div key={post.id} className={index === 0 ? "flex h-full min-w-0 w-full" : "hidden h-full min-w-0 w-full lg:flex"}>
                <PostCard post={post} author={author} />
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
