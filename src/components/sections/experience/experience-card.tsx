import { cn } from "@/lib/utils";
import type { Experience } from "@/types/experience";
import { TechStackBar } from "./tech-stack-bar";
import { Tag } from "@/components/ui/tag";
import { CursorZone } from "@/components/global/cursor/cursor-zone";
import { useTheme } from "@/providers/theme-provider";

interface ExperienceCardProps {
    experience: Experience;
}

export const ExperienceCard = ({ experience }: ExperienceCardProps) => {
    const { theme } = useTheme()
    const isLight = theme === 'light'

    return (
        <CursorZone variant="scene">
            <div
                className={cn(
                    'group relative',
                    'w-full rounded-2xl border border-border bg-surface p-5 md:p-6',
                    'transition-all duration-300',
                    'hover:border-border/80 hover:shadow-[0_4px_24px_rgba(0,0,0,0.15)]',
                    isLight && 'hover:shadow-[0_4px_24px_rgba(0,0,0,0.05)]'
                )}
            >
                <div className={cn(
                    'absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none',
                    'bg-linear-to-br from-accent/5 to-transparent',
                    'group-hover:opacity-100',
                )} />

                {/* Date */}
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                    {experience.dateRange}
                </p>

                {/* Role & Company */}
                <h3 className="text-lg font-bold text-text-primary md:text-xl">
                    {experience.role}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-text-secondary">
                    {experience.company}
                    {experience.location && (
                    <span className="ml-2 text-text-secondary/60">
                        · {experience.location}
                    </span>
                    )}
                </p>

                {/* Achievements */}
                <ul className="mt-4 space-y-2">
                    {experience.achievements.map((achievement, i) => (
                    <li
                        key={i}
                        className="flex items-start gap-2 text-sm leading-relaxed text-text-primary/90"
                    >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                        {achievement}
                    </li>
                    ))}
                </ul>

                {/* Tech Stack Bar */}
                <TechStackBar distribution={experience.techDistribution} />

                {/* Stack Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {experience.techStack.map((tech) => (
                    <Tag
                        key={tech}
                        variant="filter"
                        className="rounded-md bg-background text-[11px] px-2 py-0.5"
                    >
                        {tech}
                    </Tag>
                    ))}
                </div>
            </div>
        </CursorZone>
    )
}