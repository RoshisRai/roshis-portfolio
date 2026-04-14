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
        lenis.scrollTo(el, { offset, duration: 1.2 })
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