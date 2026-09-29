export type CtaLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  id: string;
  label: string;
  hrefEnvKey: string;
  fallback: string;
  icon: string;
  isEmail?: boolean;
};

export type HeroContent = {
  badge: string;
  greeting: string;
  name: string;
  bio: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  socials: SocialLink[];
  codeWindow: {
    filename: string;
    annotation: string;
    lines: Array<Array<{ type: string; text: string }>>;
    code?: string;
  };
};

export type FocusAreaItem = {
  id: string;
  title: string;
  icon: string;
  accent: string;
  description?: string;
  lines: string[];
};

export type AboutFact = {
  id: string;
  label: string;
  icon: string;
  value?: string;
  valueEnvKey?: string;
  valueFallback?: string;
};

export type AboutContent = {
  eyebrow: string;
  heading: string;
  body: string;
  cta: CtaLink;
  facts: AboutFact[];
  quote: { text: string; attribution: string };
};

export type ExperienceProject = {
  name: string;
  stack: string[];
  highlights: string[];
};

export type ExperienceItem = {
  id: number;
  role: string;
  company: string;
  location?: string;
  type: string;
  from: string;
  to: string;
  projects: ExperienceProject[];
};

export type PortfolioProject = {
  id: number;
  title: string;
  link: string;
  slug: string;
  description: string;
  isFeatured: boolean;
  image: string;
  stack?: string[];
  thumbnail?: string;
};
