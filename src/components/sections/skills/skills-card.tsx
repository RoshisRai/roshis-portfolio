'use client'

import { CursorZone } from "@/components/global/cursor/cursor-zone"
import { cn } from "@/lib/utils"
import type { Skill } from "@/types/skill"
import Image from "next/image"
import { useCallback, useRef, useState } from "react"

interface SkillCardProps {
    skill: Skill
}

export const SkillCard = ({ skill }: SkillCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = useCallback(() => {
        hoverTimeoutRef.current = setTimeout(() => {
            if (cardRef.current) {
                setAnchorRect(cardRef.current.getBoundingClientRect())
                setIsHovered(true)
            }
        }, 300)
    }, [])

    const handleMouseLeave = useCallback(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
        }
        setIsHovered(false)
        setAnchorRect(null)
    }, [])

    return (
        <CursorZone variant="button">
            <div
                ref={cardRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn(
                    'group relative flex flex-col items-center justify-center gap-2.5',
                    'h-27.5 w-27.5 rounded-xl border border-border bg-surface',
                    'cursor-pointer transition-all duration-(--duration-fast)',
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

                <div
                    className={cn(
                        'absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300',
                        'bg-linear-to-br from-accent/10 to-transparent',
                        'group-hover:opacity-100',
                    )}
                />
            </div>
        </CursorZone>
    )
}