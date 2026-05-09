'use client'

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { ProjectCardData } from "@/types/project"
import { projectsGridClass } from "@/lib/project-layout";
import { ProjectCard } from "./project-card";

interface ProjectsGridProps {
    projects: ProjectCardData[]
}

export const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
    const gridRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-project-card-inner]')

        cards.forEach((card, i) => {
            gsap.to(
                card,
                {
                    autoAlpha: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                    delay: i * 0.2,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
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
            {projects.map((p, i) => (
                <ProjectCard key={p.slug} project={p} priority={i === 0}  />
            ))}
        </div>
    )
}