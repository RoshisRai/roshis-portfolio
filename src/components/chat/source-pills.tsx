import { cn } from "@/lib/utils";

interface Source {
  section: string;
  title: string;
}

interface SourcePillsProps {
  sources: Source[];
}

const SECTION_COLORS: Record<string, string> = {
  experience: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  projects: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  skills: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  about: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  meta: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export function SourcePills({ sources }: SourcePillsProps) {
  if (!sources.length) return null;

  // Deduplicate by section+title
  const unique = Array.from(
    new Map(sources.map((s) => [`${s.section}-${s.title}`, s])).values()
  );

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {unique.slice(0, 3).map((source) => (
        <span
          key={`${source.section}-${source.title}`}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border",
            SECTION_COLORS[(source.section).toLowerCase()] ?? "bg-white/5 text-foreground/60 border-white/10"
          )}
        >
          <span className="capitalize">{source.section}</span>
          <span className="text-foreground/30">→</span>
          <span className="truncate max-w-30">{source.title}</span>
        </span>
      ))}
    </div>
  );
}