'use client'

import { useRef } from "react"
import type { SkillCategory as SkillCategoryType, Skill} from "@/types/skill"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { SkillCard } from "./skills-card"

interface SkillCategoryProps {
    category: SkillCategoryType
    skills: Skill[]
    index: number
}

export const SkillCategory = ({ category, skills}: SkillCategoryProps) => {

    const containerRef = useRef<HTMLDivElement>(null)
    const labelRef = useRef<HTMLHeadingElement>(null)

    useGSAP(
        () => {
            //Category label slides from left with fade-in
            gsap.from(labelRef.current, {
                x: -30,
                autoAlpha: 0,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                }
            })

            // Cards Staggered fade-in and slight upward movement
            const cards = containerRef.current?.querySelectorAll('[data-skill-card]')
            if (cards && cards.length > 0) {
                gsap.from(cards, {
                    y: 40,
                    autoAlpha: 0,
                    duration: 0.5,
                    ease: 'power3.out',
                    stagger: 0.06,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                })
            }
        },
        { scope: containerRef }
    )

    return (
        <div ref={containerRef} className="mb-12 last:mb-0">
            <h3
                ref={labelRef}
                className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary"
            >
                {category}
            </h3>
            <div className="skills-scroll-row flex md:flex-wrap gap-3 md:gap-4">
                {skills.map(skill => (
                    <div key={skill.name} data-skill-card>
                        <SkillCard skill={skill} />
                    </div>
                ))}
            </div>
        </div>
    )
}