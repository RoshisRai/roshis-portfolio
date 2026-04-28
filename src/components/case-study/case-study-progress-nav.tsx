'use client'

import { useCaseStudyProgress } from "@/hooks/use-case-study-progress"
import { scrollToSection } from "@/lib/animations"
import { cn } from "@/lib/utils"
import { CursorZone } from "../global/cursor/cursor-zone"

const SECTIONS = [
    { id: 'cs-hero', label: 'Context'},
    { id: 'cs-problem', label: 'Challenge'},
    { id: 'cs-architecture', label: 'Architecture' },
    { id: 'cs-implementation', label: 'Implementation' },
    { id: 'cs-results', label: 'Results' },
    { id: 'cs-reflection', label: 'Reflection' },
] as const

export const CaseStudyProgressNav = () => {
    const { active, progress } = useCaseStudyProgress(SECTIONS.map(s => s.id))

    const handleSectionClick = (sectionId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        scrollToSection(sectionId)
    }
    
    return (
        <>
            {/* DeskTop Rail  */}
            <nav
                aria-label="Case study sections"
                className={cn(
                    'hidden md:flex md:sticky md:top-24 md:self-start',
                    'flex-row items-start gap-5',
                    'w-max shrink-0 p-4',
                    'order-2'
                )}
            >
                <div className="flex h-full flex-col items-center pt-1">
                    <div className="relative h-48 w-1 overflow-hidden rounded-full bg-border">
                        <span
                            aria-hidden
                            className="absolute inset-x-0 top-0 rounded-full bg-(--project-accent) transition-[height] duration-(--duration-fast)"
                            style={{ height: `${Math.round(progress * 100)}%` }}
                        />
                    </div>
                </div>

                <ul className="flex flex-col gap-3 self-start pt-1">
                    {SECTIONS.map((section) => (
                        <CursorZone as='li' key={section.id} variant='project' label='Go To'>
                            <a
                                href={`#${section.id}`}
                                onClick={handleSectionClick(section.id)}
                                aria-current={active === section.id ? 'true' : undefined}
                                className="group flex w-max items-center gap-3"
                            >
                                <span
                                    className={cn(
                                        'block rounded-full transition-all duration-(--duration-fast)',
                                        active === section.id
                                            ? 'w-2 h-2 bg-(--project-accent) ring-4 ring-(--project-accent/20)'
                                            : 'w-1.5 h-1.5 bg-border group-hover:bg-text-secondary',
                                    )}
                                />
                                <span
                                    className={cn(
                                        'text-xs font-mono transition-colors duration-(--duration-fast)',
                                        active === section.id
                                            ? 'text-text-primary opacity-100'
                                            : 'text-text-secondary opacity-70 group-hover:opacity-100',
                                    )}
                                >
                                    {section.label}
                                </span>
                            </a>
                        </CursorZone>
                    ))}
                </ul>
            </nav>

            {/* Mobile Progress Bar */}
            <div
                aria-hidden
                className="md:hidden fixed left-0 right-0 top-16 z-9999 h-px bg-border"
            >
                <span 
                    className="block h-full bg-(--project-accent) transition-[width duration-(--duration-fast)"
                    style={{ width: `${Math.round(progress * 100)}%`}}
                />
            </div>
        </>
    )
}