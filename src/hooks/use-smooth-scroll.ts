'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { scrollToSection } from '@/lib/animations'

export function useSmoothScroll() {
    const pathname = usePathname()
    const router = useRouter()

    const scrollTo = useCallback((href: string) => {
        const isHashLink = href.startsWith('/#')

        if (!isHashLink) {
            router.push(href)
            return
        }

        const sectionId = href.replace('/#', '')

        if (pathname === '/') {
            scrollToSection(sectionId)
        } else {
            sessionStorage.setItem('scrollTo', sectionId)
            router.push('/')
        }
    }, [pathname, router])

    return scrollTo
}