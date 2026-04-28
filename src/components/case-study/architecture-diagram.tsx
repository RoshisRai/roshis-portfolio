'use client'

import { useReducedMotion } from "@/hooks/use-reduced-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef, useState } from "react"

interface ArchitectureDiagramProps {
    src: string
    layers: string[]
    alt?: string
}

export const ArchitectureDiagram = ({ src, layers, alt }: ArchitectureDiagramProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const objectRef = useRef<HTMLObjectElement>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const reduced = useReducedMotion()

    useEffect(() => {
        if (reduced || !containerRef.current || !isLoaded) return

        const obj = objectRef.current
        const svgDoc = obj?.contentDocument
        if (!obj || !svgDoc) return

        const groups = layers
            .map((name) => svgDoc.querySelector<SVGGElement>(`[data-layer="${name}"]`))
            .filter((el): el is SVGGElement => el !== null)

        gsap.set(groups, { opacity: 0.15, filter: 'blur(4px)' })

        const trigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top 70%',
            onEnter: () => {
                gsap.to(groups, {
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.6,
                    stagger: 0.18,
                    ease: 'power2.out',
                })
            },
            onLeaveBack: () => {
                gsap.to(groups, {
                    opacity: 0.15,
                    filter: 'blur(4px)',
                    duration: 0.4,
                    ease: 'power2.out',
                })
            },
        })

        ScrollTrigger.refresh()
        return () => trigger.kill()
    }, [isLoaded, layers, reduced])
    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-x-auto touch-pan-x rounded-2xl border border-border bg-surface lg:p-6 md:p-4 p-2"
        >
            <div className="w-full h-auto bg-surface overflow-x-auto overflow-y-hidden rounded-2xl">
                <object
                    ref={objectRef}
                    data={src}
                    type="image/svg+xml"
                    aria-label={alt || "Architecture diagram"}
                    className="block w-full min-w-180 md:min-w-0 scale-[1.001] pointer-events-none select-none"
                    onLoad={() => setIsLoaded(true)}
                />
            </div>
        </div>
    )
}