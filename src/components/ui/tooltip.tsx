'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from "@/lib/utils"

interface TooltipProps {
    content: React.ReactNode
    children: React.ReactNode
    side?: 'top' | 'bottom'
    className?: string
    /** Delay before showing in ms */
    delayMs?: number
}

const Tooltip = ({
    content,
    children,
    side = 'top',
    className,
    delayMs = 300,
}:TooltipProps) => {
    const [visible, setVisible] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const show = () => {
        timerRef.current = setTimeout(() => setVisible(true), delayMs)
    }

    const hide = () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        setVisible(false)
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={(e) => {
                if(!e.currentTarget.contains(e.relatedTarget)) hide()
            }}
        >
            {children}
            <div 
                role="tooltip"
                className={cn(
                    // Positioning
                    'absolute z-50 left-1/2 -translate-x-1/2',
                    'max-w-50 w-max',
                    // Visuals
                    'rounded-lg px-3 py-2.5',
                    'bg-surface-alt border border-border',
                    'text-[12px] font-normal leading-snug text-text-primary',
                    'shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
                    // Side positioning
                    side === 'top' && 'bottom-full mb-2.5',
                    side === 'bottom' && 'top-full mt-2.5',
                    // repaint cost from simultaneous opacity + translate changes
                    'transition-all duration-(--duration-fast)',
                    'will-change-transform',
                    visible
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : side === 'top'
                            ? 'opacity-0 translate-y-1 pointer-events-none'
                            : 'opacity-0 -translate-y-1 pointer-events-none',
                    className,
                )}
                >
                {content}
            {/* Border layer */}
                <span
                    aria-hidden
                    className={cn(
                        'absolute left-1/2 -translate-x-1/2 w-0 h-0',
                        side === 'top' && [
                            'top-full',
                            'border-l-[6px] border-l-transparent',
                            'border-r-[6px] border-r-transparent',
                            'border-t-[6px] border-t-border',
                        ],
                        side === 'bottom' && [
                            'bottom-full',
                            'border-l-[6px] border-l-transparent',
                            'border-r-[6px] border-r-transparent',
                            'border-b-[6px] border-b-border',
                        ],
                    )}
                />

                {/* Fill layer — sits on top of border layer */}
                <span
                    aria-hidden
                    className={cn(
                        'absolute left-1/2 -translate-x-1/2 w-0 h-0',
                        side === 'top' && [
                            'top-full',
                            'border-l-[5px] border-l-transparent',
                            'border-r-[5px] border-r-transparent',
                            'border-t-[5px] border-t-surface-alt',
                        ],
                        side === 'bottom' && [
                            'bottom-full',
                            'border-l-[5px] border-l-transparent',
                            'border-r-[5px] border-r-transparent',
                            'border-b-[5px] border-b-surface-alt',
                        ],
                    )}
                />
            </div>
        </div>
    )
}

Tooltip.displayName = 'Tooltip'

export { Tooltip, type TooltipProps }