'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 1.5,
        })

        ;(window as Window & { __lenis?: Lenis | null }).__lenis = lenis

        lenis.on('scroll', ScrollTrigger.update)

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000)
        })

        gsap.ticker.lagSmoothing(0)

        // Pause Lenis + GSAP ticker during view transitions
        const handleStart = () => {
            lenis.stop()
            gsap.ticker.sleep()
        }
        const handleEnd = () => {
            lenis.start()
            gsap.ticker.wake()
        }

        document.addEventListener('viewtransitionstart', handleStart)
        document.addEventListener('viewtransitionend', handleEnd)

        return () => {
            document.removeEventListener('viewtransitionstart', handleStart)
            document.removeEventListener('viewtransitionend', handleEnd)
            lenis.destroy()
            ;(window as Window & { __lenis?: Lenis | null }).__lenis = null
        }
    }, [])

    return <>{children}</>
}