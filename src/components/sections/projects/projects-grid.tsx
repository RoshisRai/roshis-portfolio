'use client'

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { ProjectCardData } from "@/types/project"
import { cardSizeClasses, projectsGridClass } from "@/lib/project-layout";
import { ProjectCard } from "./project-card";
import { CursorZone } from "@/components/global/cursor/cursor-zone";
import { cn } from "@/lib/utils";

interface ProjectsGridProps {
    projects: ProjectCardData[]
}

export const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
    const gridRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-project-card]')

        cards.forEach((card, i) => {
            gsap.fromTo(
                card,
                {
                    autoAlpha: 0,
                    y: 40
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                    delay: i * 0.05,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                }
            )
        })
    }, { scope: gridRef })

    return (
        <div 
            ref={gridRef}
            data-project-grid
            className={projectsGridClass}
        >
            {projects.map((project, i) => (
                <CursorZone
                    variant='project'
                    className={cn(cardSizeClasses[project.cardSize])}
                    data-project-card={project.slug}
                    key={project.slug} 
                >
                    <div data-project-card-inner className="relative h-full">
                        <ProjectCard project={project} priority={i === 0}  />
                    </div>
            </CursorZone>
            ))}
        </div>
    )
}