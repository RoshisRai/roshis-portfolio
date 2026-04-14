'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const SECTION_IDS = ['hero', 'projects', 'skills', 'experience', 'about', 'contact']

export function useActiveSection() {
    const pathname = usePathname()
    const isHome = pathname === '/'

    const [activeSection, setActiveSection] = useState<string>('')

    useEffect(() => {
        if (!isHome) return

        const observers: IntersectionObserver[] = []
        const visibilityMap = new Map<string, number>()

        const updateActiveSection = () => {
            let maxRatio = 0
            let mostVisible = ''
            visibilityMap.forEach((ratio, id) => {
                if (ratio > maxRatio) {
                    maxRatio = ratio
                    mostVisible = id
                }
            })
            if (mostVisible) setActiveSection(mostVisible)
        }

        SECTION_IDS.forEach(id => {
            const el = document.getElementById(id)
            if (!el) return

            const observer = new IntersectionObserver(([entry]) => {
                visibilityMap.set(id, entry.intersectionRatio)
                updateActiveSection()
            }, 
            { 
                // -64px top accounts for the fixed navbar height
                rootMargin: '-64px 0px -40% 0px',
                // Fire at every 10% increment for accurate ratio tracking
                threshold: Array.from({ length: 11 }, (_, i) => i / 10),
            })

            observer.observe(el)
            observers.push(observer)
        })

        return () => {
            observers.forEach(observer => observer.disconnect())
        }
    }, [isHome])

    // When not on homepage, always return empty string
    return isHome ? activeSection : ''
}