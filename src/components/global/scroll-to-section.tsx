'use client'

import { useEffect } from 'react'
import { scrollToSection } from '@/lib/animations'

export function ScrollToSection() {
    useEffect(() => {
        const target = sessionStorage.getItem('scrollTo')
        if (!target) return
        sessionStorage.removeItem('scrollTo')

        const timer = setTimeout(() => {
            scrollToSection(target)
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    return null
}