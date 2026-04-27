import type Lenis from 'lenis'

export const getLenis = (): Lenis | null => {
    if (typeof window === 'undefined') return null
    return (window as Window & { __lenis?: Lenis | null }).__lenis ?? null
}

export const scrollToSection = (id: string, offset = -64) => {
    const lenis = getLenis()
    const el = document.getElementById(id)
    if (!el) return

    if (lenis) {
        // Route transitions can leave Lenis paused for a frame; ensure it is running.
        lenis.start()
        lenis.scrollTo(el, { offset, duration: 1.2 })

        // Fallback to native smooth scroll if Lenis did not move yet.
        window.setTimeout(() => {
            const rectTop = el.getBoundingClientRect().top
            if (Math.abs(rectTop) > 8) {
                const targetTop = window.scrollY + rectTop + offset
                window.scrollTo({ top: targetTop, behavior: 'smooth' })
            }
        }, 220)
    } else {
        el.scrollIntoView({ behavior: 'smooth' })
    }
}

export const scrollToTop = () => {
    const lenis = getLenis()
    if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 })
        return
    }

    if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}