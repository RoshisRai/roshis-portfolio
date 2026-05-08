'use client'

import { CursorZone } from "@/components/global/cursor/cursor-zone"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useLayoutEffect, useRef, useState, useEffect, type RefObject } from "react"
import { createPortal } from "react-dom"

interface SkillTooltipProps {
    usedIn: {
        projectName: string
        slug: string
        context: string
    }[]
    isVisible: boolean
    cardRef: RefObject<HTMLDivElement | null>
    onMouseEnter: () => void
    onMouseLeave: () => void
}

export const SkillTooltip = ({ usedIn, isVisible, cardRef, onMouseEnter, onMouseLeave }: SkillTooltipProps) => {
    const tooltipRef = useRef<HTMLDivElement>(null)
    const [placement, setPlacement] = useState<'above' | 'below'>('above')
    // fixed position in viewport
    const [pos, setPos] = useState({ top: 0, left: 0 })
    const [arrowLeft, setArrowLeft] = useState<number | null>(null)

    useLayoutEffect(() => {
        if (!tooltipRef.current || !cardRef.current || !isVisible) return

        const GAP = 16
        const HORIZONTAL_PADDING = 16
        const VERTICAL_PADDING = 50

        const card = cardRef.current.getBoundingClientRect()
        const tRect = tooltipRef.current.getBoundingClientRect()

        // compute preferred left centered on card
        let left = card.left + card.width / 2 - tRect.width / 2
        // clamp horizontally inside viewport
        left = Math.min(Math.max(left, HORIZONTAL_PADDING), window.innerWidth - tRect.width - HORIZONTAL_PADDING)

        // vertical candidates
        const topAbove = card.top - tRect.height - GAP
        const topBelow = card.bottom + GAP

        const fitsAbove = topAbove >= VERTICAL_PADDING
        const fitsBelow = topBelow + tRect.height <= window.innerHeight - VERTICAL_PADDING

        let top = topAbove
        if (fitsAbove) {
            top = topAbove
            setPlacement('above')
        } else if (fitsBelow) {
            top = topBelow
            setPlacement('below')
        } else {
            // choose side with more space
            const spaceAbove = card.top - VERTICAL_PADDING
            const spaceBelow = window.innerHeight - card.bottom - VERTICAL_PADDING
            if (spaceBelow >= spaceAbove) {
                top = Math.min(topBelow, window.innerHeight - tRect.height - VERTICAL_PADDING)
                setPlacement('below')
            } else {
                top = Math.max(VERTICAL_PADDING, card.top - tRect.height - GAP)
                setPlacement('above')
            }
        }

        // compute arrow offset inside tooltip so arrow lines up with card center
        const cardCenter = card.left + card.width / 2
        const arrow = Math.min(Math.max(cardCenter - left, 12), tRect.width - 12)

        setPos({ top, left })
        setArrowLeft(arrow)

    }, [isVisible, cardRef])

    // only render portal after client mount (guard against SSR)
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true))
        return () => cancelAnimationFrame(id)
    }, [])

    if (!mounted) return null

    const tooltip = (
        <div
            ref={tooltipRef}
            role="tooltip"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={cn(
                'fixed z-999999 w-64 rounded-xl border border-border bg-surface-alt p-4 shadow-xl',
                'transition-all duration-200',
                isVisible
                    ? 'pointer-events-auto scale-100 opacity-100'
                    : 'pointer-events-none scale-95 opacity-0',
            )}
            style={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
            }}
        >
            {/* Arrow — points toward the card, flips with placement */}
            <div
                className={cn(
                    'absolute h-3 w-3 rotate-45 border-border bg-surface-alt',
                    placement === 'above'
                        ? '-bottom-1.5 border-b border-r'
                        : '-top-1.5 border-t border-l',
                )}
                style={{
                    left: arrowLeft != null ? `${arrowLeft}px` : '50%',
                }}
            />

            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                Used in
            </p>

            <div className="space-y-2.5">
                {usedIn.map((project) => (
                <CursorZone key={project.slug} variant="button">
                    <Link 
                        href={`/projects/${project.slug}`}
                        className="group block"
                        >
                        <p className="text-sm font-medium text-text-primary transition-colors group-hover:text-accent">
                            {project.projectName}
                        </p>
                        <p className="text-xs text-text-secondary">{project.context}</p>
                    </Link>
                </CursorZone>
                ))}
            </div>
        </div>
    )

    // render into body so tooltip escapes any stacking context of card grid
    return createPortal(
        tooltip,
        document.body,
    )
}