import { cn } from "@/lib/utils";

export type FitTier = "Strong Fit" | "Partial Fit" | "Limited Fit";

export type JdMatchData = {
  tier: FitTier;
  strong: string[];
  partial: string[];
  gaps: string[];
  nextStep?: string;
};

type JdMatchCardProps = {
  data: JdMatchData;
};

const tierStyles: Record<FitTier, string> = {
  "Strong Fit": "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  "Partial Fit": "border-amber-500/40 bg-amber-500/10 text-amber-300",
  "Limited Fit": "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
};

export function parseJdMatch(text: string): JdMatchData | null {
  const tierMatch = text.match(/\b(Strong Fit|Partial Fit|Limited Fit)\b/i);
  if (!tierMatch) return null;

  const raw = tierMatch[1];
  const tier = (raw.charAt(0).toUpperCase() + raw.slice(1).replace(/fit/i, "Fit")) as FitTier;
  const normalized: FitTier =
    /strong/i.test(tier) ? "Strong Fit" : /partial/i.test(tier) ? "Partial Fit" : "Limited Fit";

  const extractList = (label: RegExp): string[] => {
    const block = text.match(label);
    if (!block) return [];
    const after = text.slice(block.index! + block[0].length);
    const lines = after
      .split("\n")
      .slice(0, 12)
      .map((l) => l.replace(/^[-*•]\s*/, "").trim())
      .filter((l) => l && !/^(strong|partial|gaps|gap|recommended|next)/i.test(l) && l.length < 200);
    const items: string[] = [];
    for (const line of lines) {
      if (/^(#{1,3}\s|\*\*)/.test(line) && items.length) break;
      if (/fit assessment|strong matches|partial matches|honest gaps|recommended/i.test(line) && items.length)
        break;
      if (line.startsWith("#")) break;
      items.push(line.replace(/\*\*/g, ""));
      if (items.length >= 5) break;
    }
    return items;
  };

  return {
    tier: normalized,
    strong: extractList(/strong\s+matches?\s*:?/i),
    partial: extractList(/partial\s+matches?\s*:?/i),
    gaps: extractList(/(honest\s+)?gaps?\s*:?/i),
    nextStep: text.match(/recommended\s+next\s+step\s*:?\s*(.+)/i)?.[1]?.trim(),
  };
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-[11px] font-medium text-zinc-400 mb-1">{title}</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-xs text-zinc-300 leading-snug pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-zinc-500">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function JdMatchCard({ data }: JdMatchCardProps) {
  return (
    <div
      className={cn(
        "mt-3 rounded-xl border border-white/10 bg-black/30 p-3 space-y-3",
        "ring-1 ring-white/5"
      )}
      role="region"
      aria-label="Match summary"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-white">Match Summary</p>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
            tierStyles[data.tier]
          )}
        >
          {data.tier}
        </span>
      </div>
      <List title="Strong matches" items={data.strong} />
      <List title="Partial matches" items={data.partial} />
      <List title="Gaps" items={data.gaps} />
      {data.nextStep ? (
        <p className="text-xs text-zinc-400 border-t border-white/10 pt-2">
          <span className="text-zinc-300 font-medium">Next step: </span>
          {data.nextStep}
        </p>
      ) : null}
    </div>
  );
}
