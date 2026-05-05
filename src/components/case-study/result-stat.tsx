'use client'

import { ProjectMetric } from "@/types/project";
import gsap from 'gsap'
import { useState, useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface ResultStatProps {
    metric: ProjectMetric
}

export const ResultStat = ({ metric }: ResultStatProps) => {

    const ref = useRef<HTMLDivElement>(null)
    const hasCountTo = metric.countTo !== undefined
    const [display, setDisplay] = useState(() => (hasCountTo ? 0 : metric.value))
    const reduced = useReducedMotion()
    const shouldAnimate = hasCountTo && !reduced
    const displayValue = shouldAnimate
        ? display
        : hasCountTo
            ? metric.countTo
            : metric.value

    useEffect(() => {
        if (!shouldAnimate) return
        if (!ref.current) return

        const target = { n: 0 }
        let played = false

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || played) return
                played = true
                gsap.to(target, {
                    n: metric.countTo!,
                    duration: 1.5,
                    ease: 'power2.out',
                    snap: { n: 1 },
                    onUpdate: () => setDisplay(String(target.n)),
                })
            },
            { threshold: 0.6 }
        )

        io.observe(ref.current)

        return () => io.disconnect()
    }, [metric.countTo, shouldAnimate])

    return (
        <div ref={ref} className="flex flex-col items-center text-center">
            <div
                className="font-display font-extrabold leading-none text-[clamp(40px, 6vw, 56px)] text-(--project-accent)"
                aria-label={`${metric.value}: ${metric.label}`}
            >
                {metric.prefix}
                {displayValue}
                {metric.suffix}
            </div>
            <div className="mt-3 text-md text-text-secondary">
                {metric.label}
            </div>
        </div>
    )
}