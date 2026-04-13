'use client'

import { ReactLenis } from 'lenis/react'
import type { LenisRef } from 'lenis/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const lenisOptions = {
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
}
export function LenisProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<LenisRef>(null)

    useEffect(() => {
        const lenis = lenisRef.current?.lenis
        
        // Guard against lenis not being initialized yet
        if(!lenis) return

        function update(time: number) {
            lenis?.raf(time * 1000)
        }
        gsap.ticker.add(update)

        function onScroll() {
            ScrollTrigger.update()
        }
        lenis?.on('scroll', onScroll)

        return () => {
            gsap.ticker.remove(update)
            lenis?.off('scroll', onScroll)
        }
    }, [])

    return (
        <ReactLenis ref={lenisRef} root options={lenisOptions}>
            {children}
        </ReactLenis>
    )
}