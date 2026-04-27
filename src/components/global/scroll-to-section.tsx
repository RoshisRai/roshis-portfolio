'use client'

import { useEffect } from 'react'
import { scrollToSection } from '@/lib/animations'

export function ScrollToSection() {
    useEffect(() => {
        const target = sessionStorage.getItem('scrollTo')
        if (!target) return

        let cancelled = false
        let rafId: number | null = null

        const scrollWhenReady = (attempt = 0) => {
            if (cancelled) return

            const element = document.getElementById(target)
            if (!element) {
                if (attempt > 30) return
                rafId = window.requestAnimationFrame(() => scrollWhenReady(attempt + 1))
                return
            }

            // Double RAF avoids snapping during the same paint frame as route swap.
            rafId = window.requestAnimationFrame(() => {
                rafId = window.requestAnimationFrame(() => {
                    if (!cancelled) {
                        scrollToSection(target)
                        sessionStorage.removeItem('scrollTo')
                    }
                })
            })
        }

        const kickOffScroll = () => scrollWhenReady(0)
        const onTransitionDone = () => {
            document.removeEventListener('viewtransitionend', onTransitionDone)
            document.removeEventListener('viewtransitioncancel', onTransitionDone)
            kickOffScroll()
        }

        document.addEventListener('viewtransitionend', onTransitionDone, { once: true })
        document.addEventListener('viewtransitioncancel', onTransitionDone, { once: true })

        const fallbackTimer = window.setTimeout(() => {
            onTransitionDone()
        }, 700)

        return () => {
            cancelled = true
            window.clearTimeout(fallbackTimer)
            if (rafId !== null) window.cancelAnimationFrame(rafId)
            document.removeEventListener('viewtransitionend', onTransitionDone)
            document.removeEventListener('viewtransitioncancel', onTransitionDone)
        }
    }, [])

    return null
}