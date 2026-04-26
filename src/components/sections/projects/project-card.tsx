'use client'

import { cardSizeClasses } from "@/lib/project-layout"
import { cn } from "@/lib/utils"
import { ProjectCardData } from "@/types/project"
import Link from "next/link"
import { ProjectCardMedia } from "./project-card-media"
import { navForward, projectAccentVTName } from "@/lib/project-transition"
import { CursorZone } from "@/components/global/cursor/cursor-zone"
import { projectAccentStyle } from "@/lib/project-theme"
import { ProjectCardMeta } from "./project-card-meta"
import { ProjectCardOverlay } from "./project-card-overlay"
import { useProjectCardHover } from "@/hooks/use-project-card-hover"

interface ProjectCardProps {
    project: ProjectCardData
    priority?: boolean //Priority hint for the first card's image (LCP optimization)
}

export const ProjectCard = ({
    project,
    priority = false
}: ProjectCardProps) => {
    const { hovered, intent, onEnter, onLeave } = useProjectCardHover()

    return (
            <CursorZone
                variant='project'
                className={cn(
                    cardSizeClasses[project.cardSize],
                )}
            >
                <Link
                    href={`/projects/${project.slug}`}
                    prefetch
                    transitionTypes={navForward}
                    onMouseEnter={onEnter}
                    onMouseLeave={onLeave}
                    onFocus={onEnter}
                    onBlur={onLeave}
                    style={projectAccentStyle(project.accent)}
                    className={cn(
                        'group relative flex flex-col h-full overflow-hidden rounded-2xl',
                        'bg-surface border border-border',
                        'transition-[transform,box-shadow,border-color] duration-(--duration-slow) ease-out-expo',
                        'hover:-translate-y-1 hover:border-[rgba(var(--project-accent-rgb),0.4)]',
                        'hover:shadow-[0_16px_48px_rgba(var(--project-accent-rgb),0.18)]',
                        'transform-3d perspective-distant',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--project-accent)',
                        'motion-reduce:hover:translate-y-0',
                    )}
                >
                    {/* Accent wash that participates in shared-element transition. */}
                    <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,var(--project-accent-soft),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-(--duration-fast)"
                        style={{ viewTransitionName: projectAccentVTName(project.slug) }}
                    />
                    {/* Media Region  */}
                    <div className="relative p-6 pb-0">
                        <ProjectCardMedia 
                            slug={project.slug}
                            media={project.media}
                            isHovering={hovered}
                            priority={priority}
                        />
                        <ProjectCardOverlay visible={intent} />
                    </div>
                    {/* Meta Region */}
                    <ProjectCardMeta 
                        slug={project.slug}
                        title={project.title}
                        summary={project.summary}
                        tags={project.tags}
                    />
                </Link>
            </CursorZone>
    )
}