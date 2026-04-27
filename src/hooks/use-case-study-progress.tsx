'use client'

import { useEffect, useState } from "react"

export function useCaseStudyProgress(sectionIds: string[]) {
    const [active, setActive] = useState(sectionIds[0] ?? '')
    const [progress, setProgress] = useState(0)

    useEffect(()=>{
        // Get section elements
        const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null)

        if (sections.length === 0) return

        // Track active via IntersectionObserver = picks the most-visible section
        const visibility = new Map<string, number>()

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    visibility.set(entry.target.id, entry.intersectionRatio)
                }
                let bestId = sectionIds[0]
                let bestRatio = 0
                for (const [id, ratio] of visibility) {
                    if (ratio > bestRatio) {
                        bestId = id
                        bestRatio = ratio
                    }
                }
                setActive(bestId)
            },
            { threshold: [0.1, 0.25, 0.5, 0.75, 1] }
        )

        sections.forEach((section) => io.observe(section))

        //Track linear scroll progress for the rail fill
        const onScroll = () => {
            const doc = document.documentElement
            const scrolled = doc.scrollTop
            const max = doc.scrollHeight - doc.clientHeight
            setProgress(max > 0 ? scrolled / max : 0)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()

        return () => {
            io.disconnect()
            window.removeEventListener('scroll', onScroll)
        }

    }, [sectionIds])

    return { active, progress }
}