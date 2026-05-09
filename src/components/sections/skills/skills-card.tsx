'use client'

import { CursorZone } from "@/components/global/cursor/cursor-zone"
import { cn } from "@/lib/utils"
import type { Skill } from "@/types/skill"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { SkillTooltip } from "./skills-tooltip"

interface SkillCardProps {
    skill: Skill
}

export const SkillCard = ({ skill }: SkillCardProps) => {
    const cardRef = useRef<HTMLDivElement | null>(null)

    const [isHovered, setIsHovered] = useState(false)
    
    const showTimeout = useRef<NodeJS.Timeout | null>(null)
    const hideTimeout = useRef<NodeJS.Timeout | null>(null)
    const rafRef = useRef<number | null>(null)

    const cancelHide = useCallback(() => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current)
    }, [])

    const scheduleHide = useCallback(() => {
        cancelHide()
        hideTimeout.current = setTimeout(() => {
            setIsHovered(false)
        }, 300)
    }, [cancelHide])

    const handleMouseEnter = useCallback(() => {
        cancelHide()
        if (showTimeout.current) clearTimeout(showTimeout.current)
        showTimeout.current = setTimeout(() => {
            rafRef.current = requestAnimationFrame(() => {
                setIsHovered(true)
            })
        }, 300)
    }, [cancelHide])

    const handleMouseLeave = useCallback(() => {
        if (showTimeout.current) clearTimeout(showTimeout.current)
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        scheduleHide()
    }, [scheduleHide])

    useEffect(() => {
        const closeTooltip = () => {
        if (showTimeout.current) {
            clearTimeout(showTimeout.current)
            showTimeout.current = null
        }

        if (hideTimeout.current) {
            clearTimeout(hideTimeout.current)
            hideTimeout.current = null
        }

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }

        setIsHovered(false)
    }
        window.addEventListener('scroll', closeTooltip, { passive: true })
        window.addEventListener('wheel', closeTooltip, { passive: true })
        window.addEventListener('touchmove', closeTooltip, { passive: true })

        return () => {
            window.removeEventListener('scroll', closeTooltip)
            window.removeEventListener('wheel', closeTooltip)
            window.removeEventListener('touchmove', closeTooltip)
        }
    }, [])

    return (
        <CursorZone variant="button">
            {/* overflow-visible is critical — lets the absolutely positioned
                tooltip render outside the card's visual bounds */}
            <div
                ref={cardRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn(
                    'group relative flex flex-col items-center justify-center gap-2.5',
                    'h-27.5 w-27.5 rounded-xl border border-border bg-surface',
                    'cursor-pointer transition-all duration-(--duration-fast)',
                    'overflow-visible',
                    'hover:-translate-y-1 hover:border-accent/40',
                    'hover:shadow-[0_8px_24px_var(--color-accent-glow)]',
                    'md:h-30 md:w-30',
                )}
            >
                <div className="relative h-8 w-8 transition-transform duration-200 group-hover:scale-110">
                    <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain opacity-80 transition-opacity duration-200 group-hover:opacity-100"
                    />
                </div>

                <span className="text-center text-xs font-medium text-text-secondary transition-colors duration-200 group-hover:text-text-primary">
                    {skill.name}
                </span>

                <div className={cn(
                    'absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300',
                    'bg-linear-to-br from-accent/10 to-transparent',
                    'group-hover:opacity-100',
                )} />

                {skill.usedIn && (
                    <SkillTooltip
                        usedIn={skill.usedIn}
                        isVisible={isHovered}
                        cardRef={cardRef}
                        onMouseEnter={cancelHide}
                        onMouseLeave={scheduleHide}
                    />
                )}
            </div>
        </CursorZone>
    )
}